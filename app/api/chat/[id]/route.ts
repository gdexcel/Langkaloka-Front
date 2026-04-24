// langkaloka-v1\app\api\chat\[id]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import {
  messages,
  chats,
  users,
  products,
  productImages,
  stores,
} from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { pusher } from "@/lib/pusher";
import { sendEmail } from "@/lib/mailer";

// ── Anti-spam email cooldown (in-memory, acceptable karena hanya throttle) ──
const emailCooldown = new Map<string, number>();

/**
 * Cek online status langsung dari DB.
 * Tidak import dari route lain (antipattern di Next.js serverless).
 */
async function checkUserOnline(userId: string): Promise<boolean> {
  const result = await db
    .select({ lastSeenAt: users.lastSeenAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const lastSeen = result[0]?.lastSeenAt;
  if (!lastSeen) return false;
  return Date.now() - new Date(lastSeen).getTime() < 30_000;
}

// ─────────────────────────────────────────
// GET /api/chat/[id] → ambil semua pesan
// ─────────────────────────────────────────
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const allMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, id));

  // Enrich pesan tipe 'product' dengan data produk
  const enriched = await Promise.all(
    allMessages.map(async (msg) => {
      if (msg.type === "product" && msg.productId) {
        const product = await db
          .select({
            id: products.id,
            name: products.name,
            price: products.price,
          })
          .from(products)
          .where(eq(products.id, msg.productId))
          .limit(1);

        const images = await db
          .select({ url: productImages.url })
          .from(productImages)
          .where(eq(productImages.productId, msg.productId))
          .limit(1);

        return {
          ...msg,
          product: product[0]
            ? { ...product[0], image: images[0]?.url ?? null }
            : null,
        };
      }
      return msg;
    }),
  );

  return NextResponse.json(enriched);
}

// ─────────────────────────────────────────
// POST /api/chat/[id] → kirim pesan
// ─────────────────────────────────────────
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { text } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Insert pesan ──
    const [message] = await db
      .insert(messages)
      .values({
        chatId: id,
        senderId: decoded.id,
        text: text.trim(),
      })
      .returning();

    // ── Update timestamp chat (untuk sort di chat list) ──
    await db
      .update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, id));

    // ── Pusher: kirim ke chat room ──
    await pusher.trigger(`chat-${id}`, "new-message", message);

    // ── Pusher: update chat list semua participant ──
    const chatData = await db
      .select()
      .from(chats)
      .where(eq(chats.id, id))
      .limit(1);

    const chat = chatData[0];
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await pusher.trigger("chat-list", "update", {
      chatId: id,
      senderId: decoded.id,
      buyerId: chat.buyerId,
      sellerId: chat.sellerId,
      text: text.trim(),
    });

    // ── Email notifikasi (hanya kalau lawan offline) ──
    try {
      const otherUserId =
        chat.buyerId === decoded.id ? chat.sellerId : chat.buyerId;

      const otherUserData = await db
        .select({ id: users.id, email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, otherUserId))
        .limit(1);

      const otherUser = otherUserData[0];

      if (otherUser?.email) {
        const isOnline = await checkUserOnline(otherUser.id);

        if (isOnline) {
          console.log("🟢 USER ONLINE → SKIP EMAIL");
        } else {
          const now = Date.now();
          const lastSent = emailCooldown.get(otherUser.id) ?? 0;

          if (now - lastSent > 15_000) {
            emailCooldown.set(otherUser.id, now);

            const html = `
              <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px">
                <div style="max-width:500px;margin:auto;background:white;border-radius:12px;padding:24px">
                  <h2 style="margin:0;color:#1e293b">💬 Pesan Baru</h2>
                  <p style="color:#64748b;margin-top:8px">
                    Kamu mendapat pesan baru di <b>LangkaLoka</b>
                  </p>
                  <div style="margin-top:16px;background:#f1f5f9;padding:14px 16px;border-radius:10px;border-left:3px solid #2563EB">
                    <p style="margin:0;color:#1e293b;font-size:15px">${text.trim()}</p>
                  </div>
                  <div style="margin-top:24px;text-align:center">
                    <a
                      href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/chat/${id}"
                      style="background:#2563EB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block"
                    >
                      Buka Chat →
                    </a>
                  </div>
                  <p style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center">
                    Jangan balas email ini · LangkaLoka
                  </p>
                </div>
              </div>
            `;

            await sendEmail(
              otherUser.email,
              "Pesan Baru di LangkaLoka 💬",
              html,
            );
            console.log("📩 EMAIL SENT to", otherUser.email);
          } else {
            console.log("⏳ EMAIL SKIPPED (cooldown)");
          }
        }
      }
    } catch (emailErr) {
      // Jangan crash request utama gara-gara email gagal
      console.error("❌ EMAIL ERROR:", emailErr);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("[POST /api/chat/[id]]", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}

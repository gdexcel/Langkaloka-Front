//langkaloka-v1\app\api\chat\[id]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { messages, chats, users, products, productImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { pusher } from "@/lib/pusher";
import { sendEmail } from "@/lib/mailer";

// 🔥 IMPORT ONLINE CHECK
import { isUserOnline } from "@/app/api/user/online/route";

// 🔥 ANTI SPAM EMAIL
const emailCooldown = new Map<string, number>();

// 🔥 GET → ambil semua message
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const allMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, id));

  // 🔥 Enrich product messages
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

// 🔥 POST → kirim message
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { text } = body;

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 INSERT MESSAGE
    const [message] = await db
      .insert(messages)
      .values({
        chatId: id,
        senderId: decoded.id,
        text,
      })
      .returning();

    // 🔥 UPDATE CHAT
    await db
      .update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, id));

    // 🔥 PUSHER CHAT ROOM
    await pusher.trigger(`chat-${id}`, "new-message", message);

    const chatDataForRealtime = await db
      .select()
      .from(chats)
      .where(eq(chats.id, id))
      .limit(1);

    const chatRealtime = chatDataForRealtime[0];

    // 🔥 PUSHER CHAT LIST
    await pusher.trigger("chat-list", "update", {
      chatId: id,
      senderId: decoded.id,
      buyerId: chatRealtime?.buyerId,
      sellerId: chatRealtime?.sellerId,
      text,
    });

    console.log("🔥 PUSHER CHAT LIST TRIGGERED", id);

    // ===============================
    // 🔥 EMAIL NOTIFICATION (FINAL + ONLINE CHECK)
    // ===============================
    try {
      const chatData = await db
        .select()
        .from(chats)
        .where(eq(chats.id, id))
        .limit(1);

      const chat = chatData[0];

      if (chat) {
        const otherUserId =
          chat.buyerId === decoded.id ? chat.sellerId : chat.buyerId;

        const otherUserData = await db
          .select()
          .from(users)
          .where(eq(users.id, otherUserId))
          .limit(1);

        const otherUser = otherUserData[0];

        if (otherUser?.email) {
          // 🟢 STEP 3: CHECK ONLINE
          if (isUserOnline(otherUser.id)) {
            console.log("🟢 USER ONLINE → SKIP EMAIL");
          } else {
            // 🔥 ANTI SPAM
            const now = Date.now();
            const lastSent = emailCooldown.get(otherUser.id) || 0;

            if (now - lastSent > 15000) {
              emailCooldown.set(otherUser.id, now);

              // ✨ EMAIL DESIGN
              const html = `
                <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px">
                  <div style="max-width:500px;margin:auto;background:white;border-radius:12px;padding:20px">
                    
                    <h2 style="margin:0;color:#111">💬 Pesan Baru</h2>
                    <p style="color:#666;margin-top:8px">
                      Kamu mendapat pesan baru di <b>LangkaLoka</b>
                    </p>

                    <div style="margin-top:16px;background:#f3f4f6;padding:12px;border-radius:8px">
                      <p style="margin:0;color:#111">
                        ${text}
                      </p>
                    </div>

                    <div style="margin-top:20px;text-align:center">
                      <a 
                        href="http://localhost:3000/chat/${id}"
                        style="
                          background:black;
                          color:white;
                          padding:10px 16px;
                          border-radius:8px;
                          text-decoration:none;
                          display:inline-block;
                        "
                      >
                        👉 Buka Chat
                      </a>
                    </div>

                    <p style="margin-top:20px;font-size:12px;color:#999;text-align:center">
                      Jangan balas email ini
                    </p>

                  </div>
                </div>
              `;

              await sendEmail(
                otherUser.email,
                "Pesan Baru di LangkaLoka 💬",
                html,
              );

              console.log("📩 EMAIL SENT (OFFLINE USER)");
            } else {
              console.log("⏳ EMAIL SKIPPED (COOLDOWN)");
            }
          }
        }
      }
    } catch (err) {
      console.log("❌ EMAIL ERROR (gapapa):", err);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}

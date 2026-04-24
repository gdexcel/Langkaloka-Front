// langkaloka-v1\app\api\chat\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { chats, messages, users, stores, products } from "@/db/schema";
import { eq, or, desc, sql, and, isNull } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.id;

    // ── Step 1: ambil semua chat user ini ──
    const userChats = await db
      .select({
        id: chats.id,
        buyerId: chats.buyerId,
        sellerId: chats.sellerId,
        productId: chats.productId,
        updatedAt: chats.updatedAt,
      })
      .from(chats)
      .where(or(eq(chats.buyerId, userId), eq(chats.sellerId, userId)))
      .orderBy(desc(chats.updatedAt));

    // ── Step 2: enrich tiap chat ──
    const enriched = await Promise.all(
      userChats.map(async (chat) => {
        const isBuyer = chat.buyerId === userId;

        // ID lawan chat
        const otherUserId = isBuyer ? chat.sellerId : chat.buyerId;

        // ── Data lawan chat ──
        const otherUserData = await db
          .select({
            id: users.id,
            name: users.name,
            lastSeenAt: users.lastSeenAt,
          })
          .from(users)
          .where(eq(users.id, otherUserId))
          .limit(1);

        const otherUser = otherUserData[0] ?? null;

        // ── Online check (30 detik threshold) ──
        const lastSeen = otherUser?.lastSeenAt
          ? new Date(otherUser.lastSeenAt)
          : null;
        const isOnline = lastSeen
          ? Date.now() - lastSeen.getTime() < 30_000
          : false;

        // ── Toko penjual (seller's store) ──
        // Kalau user = buyer → tampilkan toko seller
        // Kalau user = seller → tampilkan nama buyer (otherUser), bukan toko sendiri
        const sellerId = chat.sellerId;
        let store: { id: string; name: string; image: string | null } | null =
          null;

        if (isBuyer) {
          const storeData = await db
            .select({
              id: stores.id,
              name: stores.name,
              image: stores.image,
            })
            .from(stores)
            .where(eq(stores.ownerId, sellerId))
            .limit(1);
          store = storeData[0] ?? null;
        }
        // Seller → store = null, pakai otherUser (buyer) sebagai nama

        // ── Last message ──
        const lastMsgData = await db
          .select({
            text: messages.text,
            type: messages.type,
            senderId: messages.senderId,
          })
          .from(messages)
          .where(eq(messages.chatId, chat.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);

        const lastMsg = lastMsgData[0] ?? null;
        let lastMessageText: string | null = null;

        if (lastMsg) {
          if (lastMsg.type === "product") {
            lastMessageText = "📦 Produk dikirim";
          } else {
            lastMessageText =
              lastMsg.senderId === userId
                ? `Kamu: ${lastMsg.text}`
                : lastMsg.text;
          }
        }

        // ── Unread count: pesan dari lawan yang belum dibaca ──
        const unreadData = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(messages)
          .where(
            and(
              eq(messages.chatId, chat.id),
              eq(messages.senderId, otherUserId), // pesan dari lawan
              isNull(messages.readAt), // belum dibaca
            ),
          );

        const unreadCount = unreadData[0]?.count ?? 0;

        return {
          id: chat.id,
          buyerId: chat.buyerId,
          sellerId: chat.sellerId,
          updatedAt: chat.updatedAt,

          // Nama toko (prioritas) atau nama user sebagai fallback
          // Seller: store=null → tampilkan nama buyer
          storeName: store?.name ?? otherUser?.name ?? "User",
          storeImage: store?.image ?? null,
          storeId: store?.id ?? null,

          // Data lawan chat (untuk avatar fallback)
          otherUserId,
          otherUserName: otherUser?.name ?? "User",

          // Status online lawan chat
          isOnline,
          lastSeenAt: otherUser?.lastSeenAt ?? null,

          // Pesan terakhir
          lastMessage: lastMessageText,

          // Jumlah pesan belum dibaca
          unreadCount,
        };
      }),
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("[GET /api/chat]", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 },
    );
  }
}

//langkaloka-v1\app\api\chat\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { chats, messages, users } from "@/db/schema";
import { eq, or, desc, sql } from "drizzle-orm";
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

    const userChats = await db
      .select({
        id: chats.id,
        buyerId: chats.buyerId,
        sellerId: chats.sellerId,
        updatedAt: chats.updatedAt,

        // 🔥 LAWAN CHAT (IMPORTANT)
        otherUserName: sql<string>`
          (
            SELECT name FROM users
            WHERE users.id = 
              CASE 
                WHEN chats.buyer_id = ${userId} THEN chats.seller_id
                ELSE chats.buyer_id
              END
            LIMIT 1
          )
        `,

        // 🔥 LAST MESSAGE
        lastMessage: sql<string>`
          (
            SELECT text FROM messages
            WHERE messages.chat_id = chats.id
            ORDER BY created_at DESC
            LIMIT 1
          )
        `,
      })
      .from(chats)
      .where(or(eq(chats.buyerId, userId), eq(chats.sellerId, userId)))
      .orderBy(desc(chats.updatedAt));

    return NextResponse.json(userChats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 },
    );
  }
}

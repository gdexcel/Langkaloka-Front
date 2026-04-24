//langkaloka-v1\app\api\chat\[id]\read\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { messages } from "@/db/schema";
import { eq, and, isNull, ne } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { pusher } from "@/lib/pusher";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token!);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ FIX: HANYA MESSAGE DARI LAWAN
    const unreadMessages = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.chatId, id),
          isNull(messages.readAt),
          ne(messages.senderId, user.id), // 🔥 INI FIX NYA
        ),
      );

    if (unreadMessages.length === 0) {
      return NextResponse.json({ ok: true });
    }

    // 🔥 update jadi read
    await db
      .update(messages)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(messages.chatId, id),
          isNull(messages.readAt),
          ne(messages.senderId, user.id), // 🔥 WAJIB JUGA DI SINI
        ),
      );

    // 🔥 trigger realtime per message
    for (const msg of unreadMessages) {
      await pusher.trigger(`chat-${id}`, "read", {
        messageId: msg.id,
        readerId: user.id,
        readAt: new Date(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

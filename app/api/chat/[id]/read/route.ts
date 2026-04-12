import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { messages } from "@/db/schema"
import { eq, and, isNull } from "drizzle-orm"
import { verifyToken } from "@/lib/auth"
import { pusher } from "@/lib/pusher"

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params

    const authHeader = req.headers.get("authorization")
    const token = authHeader?.split(" ")[1]
    const user = verifyToken(token!)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 🔥 UPDATE SEMUA MESSAGE JADI READ
    await db
      .update(messages)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(messages.chatId, id),
          isNull(messages.readAt)
        )
      )

    // 🔥 REALTIME UPDATE
    await pusher.trigger(`chat-${id}`, "read", {
      chatId: id
    })

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
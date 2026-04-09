import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { messages } from "@/db/schema"
import { eq } from "drizzle-orm"
import { verifyToken } from "@/lib/auth"

// 🔥 GET → ambil semua message
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params

    const allMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, id))

    return NextResponse.json(allMessages)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// 🔥 POST → kirim message
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params
    const body = await req.json()
    const { text } = body

    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [message] = await db
      .insert(messages)
      .values({
        chatId: id,
        senderId: decoded.id,
        text
      })
      .returning()

    return NextResponse.json(message)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
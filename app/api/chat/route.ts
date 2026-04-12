import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { chats } from "@/db/schema"
import { eq, or, desc } from "drizzle-orm"
import { verifyToken } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {

    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = decoded.id

    const userChats = await db
      .select()
      .from(chats)
      .where(
        or(
          eq(chats.buyerId, userId),
          eq(chats.sellerId, userId)
        )
      )
      .orderBy(desc(chats.updatedAt)) // 🔥 INI KUNCI

    return NextResponse.json(userChats)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    )
  }
}
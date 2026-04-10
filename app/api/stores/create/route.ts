import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { stores } from "@/db/schema"
import { verifyToken } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {

  try {

    const body = await req.json()
   const { name, description, image, location } = body

    if (!name) {
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 }
      )
    }

    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 🔥 CEK APAKAH USER SUDAH PUNYA STORE
    const existingStore = await db
      .select()
      .from(stores)
      .where(eq(stores.ownerId, decoded.id))
      .limit(1)

    if (existingStore.length > 0) {
      return NextResponse.json(
        { error: "User already has a store" },
        { status: 400 }
      )
    }

    // 🔥 CREATE STORE
    const [store] = await db.insert(stores).values({
  name,
  description,
  image,
  location,
  ownerId: decoded.id,
}).returning()

    return NextResponse.json(store)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    )

  }

}
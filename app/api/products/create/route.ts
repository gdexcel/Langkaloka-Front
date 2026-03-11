import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { products } from "@/db/schema"
import { verifyToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {

    const body = await req.json()

    const { name, description, price, condition, storeId, categoryId } = body

    const authHeader = req.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [product] = await db.insert(products).values({
      storeId,
      categoryId,
      name,
      description,
      price,
      condition,
    }).returning()

    return NextResponse.json(product)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
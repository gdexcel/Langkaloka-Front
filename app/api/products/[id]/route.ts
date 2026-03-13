import { NextResponse } from "next/server"
import { db } from "@/db/client"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)

    if (!product.length) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(product[0])

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )

  }
}
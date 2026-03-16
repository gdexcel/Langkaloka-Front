import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { products, productImages } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params

    const product = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        condition: products.condition,
        image: productImages.url
      })
      .from(products)
      .leftJoin(
        productImages,
        eq(products.id, productImages.productId)
      )
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
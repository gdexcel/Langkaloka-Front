import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { stores, products, productImages } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params

    // ambil store
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, id))
      .limit(1)

    if (!store.length) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      )
    }

    // ambil products dari store + image
    const storeProducts = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image: productImages.url
      })
      .from(products)
      .leftJoin(
        productImages,
        eq(products.id, productImages.productId)
      )
      .where(eq(products.storeId, id))

    return NextResponse.json({
      store: store[0],
      products: storeProducts
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    )

  }
}
import { NextResponse } from "next/server"
import { db } from "@/db/client"
import { products, productImages } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {

  try {

    const allProducts = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        image: productImages.url
      })
      .from(products)
      .leftJoin(
        productImages,
        eq(products.id, productImages.productId)
      )
      .where(eq(products.isSold, false)) // 🔥 DISINI

    return NextResponse.json(allProducts)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )

  }

}
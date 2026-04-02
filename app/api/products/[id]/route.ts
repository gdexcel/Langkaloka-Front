import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { products, productImages } from "@/db/schema"
import { eq } from "drizzle-orm"
import { verifyToken } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params

    const product = await db
      .select({
        id: products.id,
        storeId: products.storeId,
        name: products.name,
        description: products.description,
        price: products.price,
        condition: products.condition,
       image: productImages.url,
       isSold: products.isSold
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

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params

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

    // 🔥 UPDATE JADI SOLD
    await db
      .update(products)
      .set({ isSold: true })
      .where(eq(products.id, id))

    return NextResponse.json({
      message: "Product marked as sold"
    })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to mark as sold" },
      { status: 500 }
    )

  }
}
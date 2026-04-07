import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { products, productImages } from "@/db/schema"
import { eq } from "drizzle-orm"
import { verifyToken } from "@/lib/auth"
import { stores } from "@/db/schema"


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
    isSold: products.isSold,
    storeOwnerId: stores.ownerId, // 🔥 INI PENTING
  })
  .from(products)
  .leftJoin(stores, eq(products.storeId, stores.id))
  .leftJoin(productImages, eq(products.id, productImages.productId))
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 🔥 ambil product
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)

    if (!product.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // 🔥 ambil store
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, product[0].storeId))
      .limit(1)

    if (!store.length) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // 🔥 VALIDASI OWNER
    if (store[0].ownerId !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // 🔥 update sold
    await db
      .update(products)
      .set({ isSold: true })
      .where(eq(products.id, id))

    return NextResponse.json({ message: "Product marked as sold" })

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to mark as sold" },
      { status: 500 }
    )
  }
}
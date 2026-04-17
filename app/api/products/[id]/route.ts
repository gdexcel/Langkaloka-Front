//langkaloka-v1\app\api\products\[id]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, productImages, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { stores } from "@/db/schema";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    // 🔥 Query product (tanpa join images)
    const product = await db
      .select({
        id: products.id,
        storeId: products.storeId,
        name: products.name,
        description: products.description,
        price: products.price,
        condition: products.condition,
        isSold: products.isSold,
        category: categories.name,
        storeName: stores.name,
        storeLocation: stores.location,
        storeOwnerId: stores.ownerId,
      })
      .from(products)
      .leftJoin(stores, eq(products.storeId, stores.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id))
      .limit(1);

    if (!product.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 🔥 Query semua images produk ini
    const images = await db
      .select({ url: productImages.url })
      .from(productImages)
      .where(eq(productImages.productId, id));

    return NextResponse.json({
      ...product[0],
      images: images.map((img) => img.url), // array of urls
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const body = await req.json();
    const { isSold } = body;

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 ambil product
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 🔥 ambil store
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, product[0].storeId))
      .limit(1);

    if (!store.length) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // 🔥 VALIDASI OWNER
    if (store[0].ownerId !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🔥 update sold
    await db.update(products).set({ isSold }).where(eq(products.id, id));

    return NextResponse.json({ message: "Product marked as sold" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to mark as sold" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 ambil product
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 🔥 ambil store
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, product[0].storeId))
      .limit(1);

    if (!store.length) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // 🔥 VALIDASI OWNER
    if (store[0].ownerId !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🔥 DELETE PRODUCT
    await db.delete(products).where(eq(products.id, id));

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}

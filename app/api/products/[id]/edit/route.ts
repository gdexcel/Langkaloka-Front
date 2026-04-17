import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, stores, productImages } from "@/db/schema"; // tambah productImages
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const body = await req.json();
    const { name, price, description, condition, images } = body; // ✅ ambil images & condition

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!product.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, product[0].storeId))
      .limit(1);

    if (!store.length) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    if (store[0].ownerId !== decoded.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Update data produk (tambah condition)
    await db
      .update(products)
      .set({ name, price, description, condition })
      .where(eq(products.id, id));

    // ✅ Update images: hapus semua lama, insert yang baru
    if (images && Array.isArray(images)) {
      await db.delete(productImages).where(eq(productImages.productId, id));

      if (images.length > 0) {
        await db.insert(productImages).values(
          images.map((url: string) => ({
            productId: id,
            url,
          })),
        );
      }
    }

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

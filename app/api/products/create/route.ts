// langkaloka-v1\app\api\products\create\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, stores, productImages } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, condition, images, categoryId } = body;
    // images = array URL yang sudah di-upload frontend
    // PENTING: frontend harus kirim { url, slotIndex } bukan array URL mentah
    // agar order di DB = slot index asli, bukan index setelah filter null

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.ownerId, decoded.id))
      .limit(1);

    if (!store.length) {
      return NextResponse.json({ error: "User has no store" }, { status: 400 });
    }

    const storeId = store[0].id;

    const [product] = await db
      .insert(products)
      .values({
        storeId,
        categoryId: categoryId || null,
        name,
        description,
        price,
        condition,
      })
      .returning();

    if (images && images.length > 0) {
      // ✅ FIX: images dikirim sebagai [{ url, slotIndex }]
      // sehingga order di DB = slotIndex asli dari UI (0 = foto utama)
      // bukan index setelah null di-filter
      await db.insert(productImages).values(
        images.map(
          ({ url, slotIndex }: { url: string; slotIndex: number }) => ({
            productId: product.id,
            url,
            order: slotIndex,
          }),
        ),
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}

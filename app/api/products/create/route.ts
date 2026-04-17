//langkaloka-v1\app\api\products\create\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, stores, productImages } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, description, price, condition, image, categoryId } = body;

    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // cari store milik user
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.ownerId, decoded.id))
      .limit(1);

    if (!store.length) {
      return NextResponse.json({ error: "User has no store" }, { status: 400 });
    }

    const storeId = store[0].id;

    // create product
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

    // simpan image jika ada
    if (image) {
      await db.insert(productImages).values({
        productId: product.id,
        url: image,
      });
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

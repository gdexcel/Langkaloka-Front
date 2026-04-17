//langkaloka-v1\app\api\seller\products\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, productImages, stores } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
      return NextResponse.json(null);
    }

    // 🔥 Subquery: ambil 1 image pertama per product
    const firstImage = db
      .select({
        productId: productImages.productId,
        url: sql<string>`MIN(${productImages.url})`.as("url"),
      })
      .from(productImages)
      .groupBy(productImages.productId)
      .as("first_image");

    const sellerProducts = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        isSold: products.isSold,
        image: firstImage.url,
      })
      .from(products)
      .leftJoin(firstImage, eq(products.id, firstImage.productId))
      .where(eq(products.storeId, store[0].id));

    return NextResponse.json(sellerProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch seller products" },
      { status: 500 },
    );
  }
}

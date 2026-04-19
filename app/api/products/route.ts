//langkaloka-v1\app\api\products\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, productImages, categories } from "@/db/schema";
import { eq, ilike, or, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    // 🔥 Subquery: 1 image pertama per product
    const firstImage = db
      .selectDistinctOn([productImages.productId], {
        productId: productImages.productId,
        url: productImages.url,
      })
      .from(productImages)
      .orderBy(productImages.productId, productImages.order)
      .as("first_image");

    const baseQuery = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        condition: products.condition,
        image: firstImage.url,
        category: categories.name,
      })
      .from(products)
      .leftJoin(firstImage, eq(products.id, firstImage.productId))
      .leftJoin(categories, eq(products.categoryId, categories.id));

    const allProducts = q
      ? await baseQuery.where(
          and(
            eq(products.isSold, false),
            or(
              ilike(products.name, `%${q}%`),
              ilike(products.description, `%${q}%`),
            ),
          ),
        )
      : await baseQuery.where(eq(products.isSold, false));

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

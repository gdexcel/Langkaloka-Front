//langkaloka-v1\app\api\stores\[id]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { stores, products, productImages, storeRatings } from "@/db/schema";
import { avg, eq, and, sql } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    // 🔥 STORE
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, id))
      .limit(1);

    if (!store.length) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // 🔥 PRODUCTS
    const firstImage = db
      .select({
        productId: productImages.productId,
        url: sql<string>`MIN(${productImages.url})`.as("url"),
      })
      .from(productImages)
      .groupBy(productImages.productId)
      .as("first_image");

    const storeProducts = await db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        image: firstImage.url,
      })
      .from(products)
      .leftJoin(firstImage, eq(products.id, firstImage.productId))
      .where(eq(products.storeId, id));

    // 🔥 AVG RATING
    const ratingResult = await db
      .select({
        avgRating: avg(storeRatings.rating),
      })
      .from(storeRatings)
      .where(eq(storeRatings.storeId, id));

    const avgRating = Number(ratingResult[0]?.avgRating || 0);

    // 🔥 BREAKDOWN (WAJIB DI LUAR AUTH)
    const ratingCounts = await db
      .select({
        rating: storeRatings.rating,
      })
      .from(storeRatings)
      .where(eq(storeRatings.storeId, id));

    const breakdown = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratingCounts.forEach((r) => {
      breakdown[r.rating as 1 | 2 | 3 | 4 | 5]++;
    });

    const totalRatings = ratingCounts.length;

    const ratingPercentages = {
      1: totalRatings ? (breakdown[1] / totalRatings) * 100 : 0,
      2: totalRatings ? (breakdown[2] / totalRatings) * 100 : 0,
      3: totalRatings ? (breakdown[3] / totalRatings) * 100 : 0,
      4: totalRatings ? (breakdown[4] / totalRatings) * 100 : 0,
      5: totalRatings ? (breakdown[5] / totalRatings) * 100 : 0,
    };

    // 🔥 USER RATING (OPTIONAL)
    const authHeader = req.headers.get("authorization");
    let userRating: number | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const user = verifyToken(token);

      if (user) {
        const existing = await db
          .select()
          .from(storeRatings)
          .where(
            and(eq(storeRatings.storeId, id), eq(storeRatings.userId, user.id)),
          )
          .limit(1);

        userRating = existing.length > 0 ? existing[0].rating : null;
      }
    }

    // 🔥 FINAL RETURN
    return NextResponse.json({
      store: store[0],
      products: storeProducts,
      avgRating,
      userRating,
      ratingPercentages,
      totalRatings,
    });
  } catch (error) {
    console.error("[STORE DETAIL ERROR]", error);

    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 },
    );
  }
}

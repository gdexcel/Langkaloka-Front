// langkaloka-v1\app\api\favorites\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { favorites, products, productImages } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "ProductId is required" },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, decoded.id),
          eq(favorites.productId, productId),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Already in favorites" },
        { status: 200 },
      );
    }

    const [favorite] = await db
      .insert(favorites)
      .values({
        userId: decoded.id,
        productId,
      })
      .returning();

    return NextResponse.json(favorite);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 },
    );
  }
}

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

    // 🔥 Subquery: ambil 1 image pertama per product
    const firstImage = db
      .select({
        productId: productImages.productId,
        url: sql<string>`MIN(${productImages.url})`.as("url"),
      })
      .from(productImages)
      .groupBy(productImages.productId)
      .as("first_image");

    const userFavorites = await db
      .select({
        favoriteId: favorites.id,
        productId: products.id,
        name: products.name,
        price: products.price,
        image: firstImage.url,
      })
      .from(favorites)
      .leftJoin(products, eq(favorites.productId, products.id))
      .leftJoin(firstImage, eq(products.id, firstImage.productId))
      .where(eq(favorites.userId, decoded.id));

    return NextResponse.json(userFavorites);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 },
    );
  }
}

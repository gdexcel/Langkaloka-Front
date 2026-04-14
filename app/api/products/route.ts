import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, productImages } from "@/db/schema";
import { eq, ilike, or, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    let allProducts;

    // 🔥 SEARCH - filter di server-side
    if (q) {
      allProducts = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          condition: products.condition,
          image: productImages.url,
        })
        .from(products)
        .leftJoin(productImages, eq(products.id, productImages.productId))
        .where(
          and(
            eq(products.isSold, false),
            or(
              ilike(products.name, `%${q}%`),
              ilike(products.description, `%${q}%`),
            ),
          ),
        );
    } else {
      // Semua produk
      allProducts = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          condition: products.condition,
          image: productImages.url,
        })
        .from(products)
        .leftJoin(productImages, eq(products.id, productImages.productId))
        .where(eq(products.isSold, false));
    }

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

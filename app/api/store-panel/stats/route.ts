//langkaloka-v1\app\api\store-panel\stats\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { products, stores } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

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

    // 🔥 ambil store user
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.ownerId, decoded.id))
      .limit(1);

    if (store.length < 1) {
      return NextResponse.json([], { status: 200 });
    }

    const storeId = store[0].id;

    // 🔥 ambil semua produk
    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.storeId, storeId));

    const total = allProducts.length;
    const sold = allProducts.filter((p) => p.isSold).length;
    const active = allProducts.filter((p) => !p.isSold).length;

    return NextResponse.json({
      storeId,
      total,
      sold,
      active,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}

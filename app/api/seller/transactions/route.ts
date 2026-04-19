// app/api/seller/transactions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { transactions, products, stores } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await db
      .select({
        id: transactions.id,
        proof: transactions.proof,
        createdAt: transactions.createdAt,

        productId: transactions.productId, // 🔥 FIX PENTING
        status: transactions.status, // 🔥 TAMBAH

        productName: products.name,
      })
      .from(transactions)
      .leftJoin(products, eq(transactions.productId, products.id))
      .leftJoin(stores, eq(products.storeId, stores.id))
      .where(eq(stores.ownerId, user.id));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
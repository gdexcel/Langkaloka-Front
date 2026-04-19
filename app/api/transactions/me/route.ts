// app/api/transactions/me/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

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

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    // 🔥 VALIDASI
    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    // 🔥 QUERY (BERSIH & FIX)
    const trx = await db.query.transactions.findFirst({
      where: and(
        eq(transactions.productId, productId),
        eq(transactions.buyerId, user.id)
      ),
    });

    return NextResponse.json(trx || null);
  } catch (error) {
    console.error("CHECK TRANSACTION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to check transaction" },
      { status: 500 }
    );
  }
}
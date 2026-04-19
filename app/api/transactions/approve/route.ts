// app/api/transactions/approve/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { transactions, products } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest) {
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

    const { transactionId, productId } = await req.json();

    // 🔥 SAFETY CHECK (PENTING BANGET)
    if (!transactionId || !productId) {
        console.log("APPROVE DATA:", {
  transactionId,
  productId,
});
      return NextResponse.json(
        { error: "Missing transactionId or productId" },
        { status: 400 }
      );
    }

    // 🔥 update transaksi
    await db
      .update(transactions)
      .set({ status: "approved" })
      .where(eq(transactions.id, transactionId));

    // 🔥 auto sold
    await db
      .update(products)
      .set({ isSold: true })
      .where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("APPROVE ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
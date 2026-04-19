import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
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

    const { productId, proof } = await req.json();

    // 🔥 CEK SUDAH PERNAH UPLOAD BELUM
    const existing = await db.query.transactions.findFirst({
      where: (t, { eq, and }) =>
        and(eq(t.productId, productId), eq(t.buyerId, user.id)),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Kamu sudah upload bukti transfer" },
        { status: 400 }
      );
    }

    const [trx] = await db
      .insert(transactions)
      .values({
        productId,
        buyerId: user.id,
        proof,
      })
      .returning();

    return NextResponse.json(trx);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
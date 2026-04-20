//langkaloka-v1\app\api\store\rate\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { storeRatings } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storeId, rating } = body;

    // 🔥 VALIDASI INPUT
    if (!storeId || !rating) {
      return NextResponse.json(
        { error: "storeId dan rating wajib diisi" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating harus 1 - 5" },
        { status: 400 },
      );
    }

    // 🔥 AUTH
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 CEK SUDAH PERNAH RATING
    const existing = await db
      .select()
      .from(storeRatings)
      .where(
        and(
          eq(storeRatings.storeId, storeId),
          eq(storeRatings.userId, user.id),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      // ❌ BLOCK (GA BOLEH UPDATE)
      return NextResponse.json(
        { error: "Kamu sudah memberi rating ke toko ini ⭐" },
        { status: 400 },
      );
    }

    // ✅ INSERT BARU
    await db.insert(storeRatings).values({
      storeId,
      userId: user.id,
      rating,
    });

    return NextResponse.json({
      message: "Rating berhasil diberikan ⭐",
      rating,
    });
  } catch (error) {
    console.error("[RATE ERROR]", error);

    return NextResponse.json(
      { error: "Failed to rate store" },
      { status: 500 },
    );
  }
}

//langkaloka-v1\app\api\favorites\[productId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { favorites } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await context.params;

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, decoded.id),
          eq(favorites.productId, productId),
        ),
      );

    return NextResponse.json({
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 },
    );
  }
}

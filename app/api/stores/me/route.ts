//langkaloka-v1\app\api\stores\me\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { stores } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(null);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(null);
    }

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.ownerId, decoded.id))
      .limit(1);

    return NextResponse.json(store[0] || null);
  } catch (error) {
    console.error(error);

    return NextResponse.json(null);
  }
}

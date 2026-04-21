//langkaloka-v1\app\api\store\me\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

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

    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.ownerId, decoded.id))
      .limit(1);

    if (store.length < 1) {
      return NextResponse.json(null);
    }

    return NextResponse.json(store[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
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

    const body = await req.json();

    const { name, description, location, image } = body;

    await db
      .update(stores)
      .set({
        name,
        description,
        location,
        ...(image && { image }), // 🔥 hanya update kalau ada
      })
      .where(eq(stores.ownerId, decoded.id));

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

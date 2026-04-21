//langkaloka-v1\app\api\stores\route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allStores = await db
      .select({
        id: stores.id,
        name: stores.name,
        image: stores.image,
        location: stores.location,
        description: stores.description,
      })
      .from(stores)
      .where(eq(stores.isActive, true));

    return NextResponse.json(allStores);
  } catch (error) {
    console.error("[STORES GET ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 },
    );
  }
}

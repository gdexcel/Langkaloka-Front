//langkaloka-v1\app\api\store\create\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { stores } from "@/db/schema";
import { verifyToken } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
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

    // 🔥 TAMBAH VA
    const { name, description, location, image, vaNumber, vaBank } = body;

    let imageUrl: string | undefined;

    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "langkaloka",
      });
      imageUrl = uploaded.secure_url;
    }

    const existingStore = await db.query.stores.findFirst({
      where: (stores, { eq }) => eq(stores.ownerId, decoded.id),
    });

    let store;

    if (existingStore) {
      const [updated] = await db
        .update(stores)
        .set({
          name,
          description,
          location,
          vaNumber,
          vaBank,
          ...(imageUrl && { image: imageUrl }),
        })
        .where(eq(stores.ownerId, decoded.id))
        .returning();

      store = updated;
    } else {
      const [created] = await db
        .insert(stores)
        .values({
          name,
          description,
          location,
          ownerId: decoded.id,
          vaNumber,
          vaBank,
          ...(imageUrl && { image: imageUrl }),
        })
        .returning();

      store = created;
    }

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

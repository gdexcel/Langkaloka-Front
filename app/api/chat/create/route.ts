//langkaloka-v1\app\api\chat\create\route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { chats, products, stores, messages } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId } = body;

    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔥 ambil product
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 🔥 ambil store (buat dapet seller)
    const store = await db
      .select()
      .from(stores)
      .where(eq(stores.id, product[0].storeId))
      .limit(1);

    if (!store.length) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const sellerId = store[0].ownerId;

    // 🔥 JANGAN BISA CHAT PRODUK SENDIRI
    if (decoded.id === sellerId) {
      return NextResponse.json(
        { error: "Tidak bisa chat produk sendiri" },
        { status: 400 },
      );
    }

    // 🔥 cek chat sudah ada belum
    const existingChat = await db
      .select()
      .from(chats)
      .where(
        and(
          eq(chats.productId, productId),
          or(
            and(eq(chats.buyerId, decoded.id), eq(chats.sellerId, sellerId)),
            and(eq(chats.buyerId, sellerId), eq(chats.sellerId, decoded.id)),
          ),
        ),
      )
      .limit(1);

    if (existingChat.length > 0) {
      return NextResponse.json(existingChat[0]);
    }

    // 🔥 create chat baru
    const [chat] = await db
      .insert(chats)
      .values({
        productId,
        buyerId: decoded.id,
        sellerId: sellerId,
      })
      .returning();

    // 🔥 AUTO INSERT PRODUCT MESSAGE (card pertama)
    await db.insert(messages).values({
      chatId: chat.id,
      senderId: decoded.id,
      text: "",
      type: "product",
      productId: productId,
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 },
    );
  }
}

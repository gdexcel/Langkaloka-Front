//langkaloka-v1\app\api\chat\typing\route.ts
import { NextRequest, NextResponse } from "next/server";
import { pusher } from "@/lib/pusher";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { chatId } = await req.json();

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const user = verifyToken(token!);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await pusher.trigger(`chat-${chatId}`, "typing", {
      userId: user.id,
    });
    await pusher.trigger("chat-list", "typing", {
      chatId,
      userId: user.id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

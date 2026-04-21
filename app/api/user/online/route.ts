//langkaloka-v1\app\api\user\online\route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const onlineUsers = new Map<string, number>();

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  const user = verifyToken(token!);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 🔥 simpan timestamp terakhir aktif
  onlineUsers.set(user.id, Date.now());

  return NextResponse.json({ ok: true });
}

// 🔥 helper
export const isUserOnline = (userId: string) => {
  const lastSeen = onlineUsers.get(userId);
  if (!lastSeen) return false;

  // dianggap online kalau aktif dalam 30 detik
  return Date.now() - lastSeen < 30000;
};

// langkaloka-v1\app\api\user\online\route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/user/online
 *
 * Dipanggil dari client secara periodik (misal setiap 20 detik)
 * untuk memperbarui lastSeenAt di database.
 *
 * Kenapa DB bukan in-memory Map?
 * → Next.js serverless tidak menjamin instance yang sama menangani
 *   setiap request. Map in-memory akan reset/berbeda antar instance,
 *   sehingga status online tidak reliable.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .update(users)
    .set({ lastSeenAt: new Date() })
    .where(eq(users.id, user.id));

  return NextResponse.json({ ok: true });
}

/**
 * GET /api/user/online?userId=xxx
 *
 * Cek apakah user tertentu online (lastSeenAt < 30 detik yang lalu).
 * Dipakai dari chat room header untuk tampilkan status online lawan chat.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const result = await db
    .select({ lastSeenAt: users.lastSeenAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const lastSeen = result[0]?.lastSeenAt;

  if (!lastSeen) {
    return NextResponse.json({ online: false, lastSeenAt: null });
  }

  const diffMs = Date.now() - new Date(lastSeen).getTime();
  const online = diffMs < 30_000; // online kalau aktif dalam 30 detik

  return NextResponse.json({ online, lastSeenAt: lastSeen });
}

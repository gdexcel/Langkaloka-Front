import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/db/client"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {

  const authHeader = req.headers.get("authorization")

  if (!authHeader) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const token = authHeader.split(" ")[1]

  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    )
  }

  // Fetch full user data dari DB
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      address: users.address,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, decoded.id))
    .limit(1)

  if (!user.length) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(user[0])
}

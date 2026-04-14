import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { db } from "@/db/client"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, phone, address } = body

    // Validasi phone kalau diisi
    if (phone) {
      // Cek apakah phone sudah dipakai user lain
      const existingPhone = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1)

      if (existingPhone.length > 0 && existingPhone[0].id !== decoded.id) {
        return NextResponse.json(
          { error: "Nomor HP sudah digunakan akun lain" },
          { status: 409 }
        )
      }
    }

    // Update user
    const [updated] = await db
      .update(users)
      .set({
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, decoded.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        phone: users.phone,
        address: users.address,
      })

    return NextResponse.json({
      message: "Profil berhasil diperbarui",
      user: updated,
    })

  } catch (error) {
    console.error("[PROFILE UPDATE ERROR]", error)

    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 }
    )
  }
}

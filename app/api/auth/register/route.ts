import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, phone, password, address } = body;

    if (!email || !phone || !password) {
      return NextResponse.json(
        { error: "Email, phone and password are required" },
        { status: 400 },
      );
    }

    const existing = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.phone, phone)))
      .limit(1);

    if (existing.length > 0) {
      const sameEmail = existing[0].email === email;
      const samePhone = existing[0].phone === phone;

      // Kalau email DAN phone sama = kemungkinan retry, return token langsung
      if (sameEmail && samePhone) {
        const token = jwt.sign(
          { id: existing[0].id, email: existing[0].email },
          process.env.JWT_SECRET!,
          { expiresIn: "1d" },
        );
        return NextResponse.json(
          {
            message: "User registered successfully",
            token,
            user: {
              id: existing[0].id,
              email: existing[0].email,
              name: existing[0].name,
              phone: existing[0].phone,
              address: existing[0].address,
            },
          },
          { status: 201 },
        );
      }

      // Email atau phone dipakai akun lain
      return NextResponse.json(
        { error: sameEmail ? "Email already exists" : "Phone already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name: name ?? null,
        phone,
        password: hashedPassword,
        address: address ?? null,
      })
      .returning();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          address: newUser.address,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';
import { asc } from 'drizzle-orm';
import { db } from '@/db/client';
import { categories } from '@/db/schema';

export async function GET() {
  try {
    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .orderBy(asc(categories.name));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 },
    );
  }
}

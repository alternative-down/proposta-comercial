import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { invoices } from '@/lib/db/schema';
import { count, ne } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await db
      .select({ count: count() })
      .from(invoices)
      .where(ne(invoices.status, 'draft'));
    const total = result[0]?.count ?? 0;
    return NextResponse.json({ count: total });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

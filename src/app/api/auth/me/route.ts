import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, userId: payload.userId, email: payload.email });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
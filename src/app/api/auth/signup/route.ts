import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      email,
      passwordHash,
      createdAt: new Date(),
    });
    const token = await signToken({ userId, email });
    const response = NextResponse.json({ ok: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
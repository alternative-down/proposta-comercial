import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { propostas } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const userPropostas = await db.select().from(propostas).where(eq(propostas.userId, payload.userId));
    return NextResponse.json(userPropostas);
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const { templateId, planType, data } = await request.json();
    const id = crypto.randomUUID();

    await db.insert(propostas).values({
      id,
      userId: payload.userId,
      templateId: templateId || 'moderno',
      planType: planType || 'draft',
      status: 'draft',
      data: data ? JSON.stringify(data) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Create proposta error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

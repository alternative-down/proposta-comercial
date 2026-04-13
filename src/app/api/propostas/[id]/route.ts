import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { propostas } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const [proposta] = await db.select().from(propostas).where(
      and(eq(propostas.id, id), eq(propostas.userId, payload.userId))
    ).limit(1);

    if (!proposta) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 });
    return NextResponse.json(proposta);
  } catch (error) {
    console.error('Get proposta error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
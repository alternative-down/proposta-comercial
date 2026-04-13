import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    // Validate webhook token
    const token = request.headers.get('asaas-access-token');
    if (ASAAS_WEBHOOK_TOKEN && token !== ASAAS_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { event, payment, subscription } = body;

    if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
      const paymentId = payment?.id;
      if (!paymentId) return NextResponse.json({ ok: true });

      // Check orders first (avulso)
      const [order] = await db.select().from(orders).where(eq(orders.asaasPaymentId, paymentId)).limit(1);
      if (order) {
        await db.update(orders).set({ status: 'confirmed', paidAt: new Date(), updatedAt: new Date() }).where(eq(orders.id, order.id));
        return NextResponse.json({ ok: true });
      }

      // Check subscriptions (mensal)
      if (subscription?.id) {
        const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.asaasSubscriptionId, subscription.id)).limit(1);
        if (sub) {
          const nextDueDate = new Date();
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          await db.update(subscriptions).set({
            status: 'active',
            currentPeriodEnd: nextDueDate,
            updatedAt: new Date(),
          }).where(eq(subscriptions.id, sub.id));
          return NextResponse.json({ ok: true });
        }
      }
    }

    if (event === 'PAYMENT_OVERDUE') {
      const paymentId = payment?.id;
      if (paymentId) {
        const [order] = await db.select().from(orders).where(eq(orders.asaasPaymentId, paymentId)).limit(1);
        if (order) {
          await db.update(orders).set({ status: 'overdue', updatedAt: new Date() }).where(eq(orders.id, order.id));
        }
      }
      if (subscription?.id) {
        const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.asaasSubscriptionId, subscription.id)).limit(1);
        if (sub) {
          await db.update(subscriptions).set({ status: 'overdue', updatedAt: new Date() }).where(eq(subscriptions.id, sub.id));
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { orders, subscriptions, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '';
const ASAAS_ENDPOINT = 'https://api.asaas.com/api/v3';
const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || '';

type BillingType = 'PIX' | 'BOLETO' | 'CREDIT_CARD';

function resolveBillingType(method?: string): BillingType {
  switch (method) {
    case 'boleto': return 'BOLETO';
    case 'credit_card': return 'CREDIT_CARD';
    case 'pix':
    default: return 'PIX';
  }
}

async function fetchPixQrCode(paymentId: string) {
  try {
    const res = await fetch(`${ASAAS_ENDPOINT}/payments/${paymentId}/pixQrCode`, {
      headers: { access_token: ASAAS_API_KEY },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Plans config
const PLANS = {
  avulso: { price: 19 * 100, name: 'Proposta Avulso', type: 'order' as const },
  mensal: { price: 49 * 100, name: 'Proposta Mensal', type: 'subscription' as const },
};

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

    const { planId, paymentMethod } = await request.json();
    if (!planId || !['avulso', 'mensal'].includes(planId)) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // Get user
    const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const plan = PLANS[planId as keyof typeof PLANS];
    const billingType = resolveBillingType(paymentMethod);

    if (plan.type === 'order') {
      // One-time payment (Avulso)
      if (!ASAAS_API_KEY) return NextResponse.json({ error: 'Gateway indisponível' }, { status: 503 });

      const paymentRes = await fetch(`${ASAAS_ENDPOINT}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', access_token: ASAAS_API_KEY },
        body: JSON.stringify({
          customer: user.asaasCustomerId || undefined,
          billingType,
          value: plan.price / 100,
          dueDate: new Date().toISOString().split('T')[0],
          description: plan.name,
          externalReference: user.id,
          notificationDisabled: false,
        }),
      });

      if (!paymentRes.ok) {
        const err = await paymentRes.text();
        return NextResponse.json({ error: `Erro Asaas: ${err}` }, { status: 502 });
      }

      const payment = await paymentRes.json();
      const orderId = crypto.randomUUID();

      await db.insert(orders).values({
        id: orderId,
        userId: user.id,
        asaasPaymentId: payment.id,
        planId,
        amount: plan.price / 100,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      let pixQrCode = null;
      if (billingType === 'PIX') {
        pixQrCode = await fetchPixQrCode(payment.id);
      }

      return NextResponse.json({
        type: 'order',
        paymentId: payment.id,
        orderId,
        pixQrCode,
        billingType,
        amount: plan.price / 100,
      });

    } else {
      // Subscription (Mensal)
      if (!ASAAS_API_KEY) return NextResponse.json({ error: 'Gateway indisponível' }, { status: 503 });

      // Ensure Asaas customer
      let customerId = user.asaasCustomerId;
      if (!customerId) {
        const customerRes = await fetch(`${ASAAS_ENDPOINT}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', access_token: ASAAS_API_KEY },
          body: JSON.stringify({ email: user.email, name: user.email.split('@')[0] }),
        });
        if (customerRes.ok) {
          const customer = await customerRes.json();
          customerId = customer.id;
          await db.update(users).set({ asaasCustomerId: customerId }).where(eq(users.id, user.id));
        }
      }

      const subRes = await fetch(`${ASAAS_ENDPOINT}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', access_token: ASAAS_API_KEY },
        body: JSON.stringify({
          customer: customerId,
          billingType,
          nextDueDate: new Date().toISOString().split('T')[0],
          value: plan.price / 100,
          cycle: 'MONTHLY',
          description: plan.name,
          externalReference: user.id,
          notificationDisabled: false,
        }),
      });

      if (!subRes.ok) {
        const err = await subRes.text();
        return NextResponse.json({ error: `Erro Asaas: ${err}` }, { status: 502 });
      }

      const subscription = await subRes.json();
      const subId = crypto.randomUUID();

      await db.insert(subscriptions).values({
        id: subId,
        userId: user.id,
        asaasSubscriptionId: subscription.id,
        planId,
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Fetch payment for PIX QR code
      const subPayments = await fetch(`${ASAAS_ENDPOINT}/subscriptions/${subscription.id}/payments`, {
        headers: { access_token: ASAAS_API_KEY },
      });
      let pixQrCode = null;
      if (subPayments.ok && billingType === 'PIX') {
        const paymentsData = await subPayments.json();
        const firstPayment = paymentsData.data?.[0];
        if (firstPayment?.id) {
          pixQrCode = await fetchPixQrCode(firstPayment.id);
        }
      }

      return NextResponse.json({
        type: 'subscription',
        subscriptionId: subscription.id,
        subId,
        pixQrCode,
        billingType,
        amount: plan.price / 100,
      });
    }
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

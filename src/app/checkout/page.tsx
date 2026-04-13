'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const PLAN_INFO = {
  avulso: {
    name: 'Avulso',
    description: '1 proposta comercial completa',
    price: 19,
    priceLabel: 'R$ 19 /proposta',
    features: [
      '1 proposta completa',
      'Todos os modelos',
      'PDF com sua marca',
      'Tabela de preços automática',
      'Link compartilhável com tracking',
      'Prazo de validade configurável',
    ],
  },
  mensal: {
    name: 'Mensal',
    description: 'Propostas ilimitadas por mês',
    price: 49,
    priceLabel: 'R$ 49 /mês',
    features: [
      'Propostas ilimitadas',
      'Todos os modelos',
      'PDF com sua marca',
      'Tabela de preços automática',
      'Link compartilhável com tracking',
      'Prazo de validade configurável',
      'Analytics de visualização',
      'Novos modelos a cada atualização',
    ],
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = (searchParams.get('plan') as keyof typeof PLAN_INFO) || 'avulso';
  const plan = PLAN_INFO[planId] || PLAN_INFO.avulso;

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'boleto' | 'credit_card'>('pix');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'order' | 'subscription';
    pixQrCode?: { encodedImage: string; payload: string } | null;
    pixPayload?: string;
    paymentId: string;
    billingType: string;
    amount: number;
    installment?: { url: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao criar pagamento');
        return;
      }
      setResult(data);
    } catch {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <header className="border-b border-amber-100 py-4 bg-white/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white text-sm">💼</div>
              <span className="font-bold text-slate-900">Proposta Comercial</span>
            </Link>
          </div>
        </header>
        <main className="max-w-md mx-auto px-6 py-16 text-center">
          {result.pixQrCode?.encodedImage ? (
            <>
              <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-sm">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Pagamento gerado!</h2>
                <p className="text-slate-600 text-sm mb-6">Escaneie o QR Code abaixo com o app do seu banco:</p>
                <img
                  src={`data:image/png;base64,${result.pixQrCode.encodedImage}`}
                  alt="PIX QR Code"
                  className="mx-auto w-56 h-56 border border-amber-100 rounded-xl"
                />
                <p className="text-xs text-slate-500 mt-4 break-all">
                  Copia e cola: <span className="font-mono">{result.pixQrCode.payload}</span>
                </p>
                <p className="text-sm text-slate-500 mt-2">Valor: <strong>R$ {result.amount}</strong></p>
              </div>
              <p className="text-slate-500 text-sm mt-6">
                Pagamento confirmado em instantes. Sua proposta fica disponível automaticamente.
              </p>
              <Link href="/login" className="inline-block mt-4 text-amber-600 font-medium text-sm hover:underline">
                Acessar minha conta →
              </Link>
            </>
          ) : result.billingType === 'BOLETO' ? (
            <>
              <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-sm">
                <div className="text-4xl mb-4">📄</div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Boleto gerado!</h2>
                <p className="text-slate-600 text-sm mb-4">
                  O boleto será enviado para seu e-mail em instantes. Você também pode copiar o código de barras abaixo.
                </p>
                <p className="text-sm text-slate-500">
                  Valor: <strong>R$ {result.amount}</strong>
                </p>
              </div>
              <p className="text-slate-500 text-sm mt-6">
                O acesso à sua proposta é liberado assim que o boleto for pago.
              </p>
              <Link href="/login" className="inline-block mt-4 text-amber-600 font-medium text-sm hover:underline">
                Acessar minha conta →
              </Link>
            </>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-sm">
                <div className="text-4xl mb-4">💳</div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Pagamento criado!</h2>
                <p className="text-slate-600 text-sm mb-4">
                  Complete o pagamento com seus dados de cartão. Valor: <strong>R$ {result.amount}</strong>
                </p>
              </div>
              <Link href="/login" className="inline-block mt-4 text-amber-600 font-medium text-sm hover:underline">
                Acessar minha conta →
              </Link>
            </>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <header className="border-b border-amber-100 py-4 bg-white/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white text-sm">💼</div>
            <span className="font-bold text-slate-900">Proposta Comercial</span>
          </Link>
          <Link href="/pricing" className="text-slate-600 hover:text-amber-600 text-sm">← Voltar</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Finalizar compra</h1>
          <p className="text-slate-600">Plano {plan.name} — {plan.priceLabel}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6">
            <h2 className="font-bold text-slate-900 mb-1">{plan.name}</h2>
            <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
            <p className="text-3xl font-bold text-slate-900 mb-6">{plan.priceLabel}</p>
            <ul className="space-y-2 text-sm text-slate-600">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2"><span className="text-green-500">✓</span> {f}</li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Forma de pagamento</h2>
            <div className="space-y-3 mb-6">
              {[
                { id: 'pix', label: 'PIX', icon: '⚡', desc: 'Aprovação instantânea' },
                { id: 'boleto', label: 'Boleto', icon: '📄', desc: 'Aprovação em até 2 dias úteis' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as 'pix' | 'boleto')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition ${
                    paymentMethod === method.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900">{method.label}</p>
                    <p className="text-xs text-slate-500">{method.desc}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <span className="ml-auto text-amber-600 font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Gerando...' : paymentMethod === 'pix' ? 'Gerar QR Code PIX →' : 'Gerar Boleto →'}
            </button>

            <p className="text-center text-slate-500 text-xs mt-4">
              Pagamento seguro via Asaas · Cancele quando quiser
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Carregando...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

'use client';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';

type PaymentMethod = 'pix' | 'boleto' | 'credit_card';

interface CheckoutResult {
  orderId: string;
  paymentId: string;
  paymentMethod: string;
  billingType: string;
  amount: number;
  invoiceUrl: string | null;
  pix?: {
    encodedImage: string | null;
    payload: string | null;
    expirationDate: string | null;
  };
  boleto?: {
    bankSlipUrl: string | null;
    invoiceUrl: string | null;
    identificationField: string | null;
    barCode: string | null;
  };
}

function PayPerUseContent() {
  const [method, setMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.error) setAuthenticated(false);
        else setAuthenticated(true);
      })
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Verificando sessão...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white rounded-2xl border border-slate-200 p-8 max-w-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Login necessário</h1>
          <p className="text-slate-600 text-sm mb-6">Você precisa estar logado para fazer o pagamento.</p>
          <Link href="/login" className="block w-full py-3 text-center bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition">
            Fazer login
          </Link>
          <Link href="/signup" className="block mt-3 w-full py-3 text-center bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition">
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  async function handleCheckout() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'pay_per_use', paymentMethod: method }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao processar pagamento');
      } else {
        setResult(data);
      }
    } catch {
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const price = 19;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-amber-100">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/pricing" className="text-slate-500 hover:text-slate-700 text-sm">← Voltar</Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white text-sm font-bold">P</div>
            <span className="font-bold text-slate-900">Proposta Comercial</span>
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Comprar proposta avulsa</h1>
        <p className="text-slate-600 mb-8">Pagamento único. Você recebe 1 proposta completa após a confirmação.</p>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold text-slate-900">Proposta Avulsa</div>
              <div className="text-sm text-slate-500">Proposta Comercial</div>
            </div>
            <div className="text-2xl font-bold text-slate-900">R$ 19</div>
          </div>
        </div>

        {!result ? (
          <>
            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
              <h2 className="font-semibold text-slate-900 mb-4">Forma de pagamento</h2>
              <div className="space-y-3">
                {[
                  { id: 'pix', label: 'PIX', desc: 'Aprovação instantânea', icon: '⚡' },
                  { id: 'boleto', label: 'Boleto', desc: 'Aprovação em até 2 dias úteis', icon: '📄' },
                  { id: 'credit_card', label: 'Cartão de crédito', desc: 'Aprovação instantânea', icon: '💳' },
                ].map(opt => (
                  <label key={opt.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${method === opt.id ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input type="radio" name="method" value={opt.id} checked={method === opt.id} onChange={() => setMethod(opt.id as PaymentMethod)} className="accent-amber-600" />
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{opt.label}</div>
                      <div className="text-xs text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Gerando pagamento...' : `Pagar R$ ${price} com ${method === 'pix' ? 'PIX' : method === 'boleto' ? 'Boleto' : 'Cartão'}`}
            </button>
          </>
        ) : (
          <div className="space-y-6">
            {/* Success state */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="text-xl font-bold text-green-800 mb-2">Pagamento gerado!</h2>
              <p className="text-green-700 text-sm">Siga as instruções abaixo para finalizar.</p>
            </div>

            {result.pix ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                <div className="text-sm text-slate-500 uppercase tracking-wider mb-4 font-semibold">Escaneie o QR Code</div>
                {result.pix.encodedImage ? (
                  <img
                    src={`data:image/png;base64,${result.pix.encodedImage}`}
                    alt="PIX QR Code"
                    className="mx-auto w-52 h-52 border border-slate-200 rounded-xl"
                  />
                ) : (
                  <div className="w-52 h-52 bg-slate-100 mx-auto rounded-xl flex items-center justify-center text-sm text-slate-500">
                    QR Code indisponível
                  </div>
                )}
                <div className="mt-4">
                  <div className="text-xs text-slate-500 mb-1">Código PIX (copie e cole):</div>
                  <div className="bg-slate-100 rounded-lg p-3 text-xs font-mono text-slate-700 break-all select-all">
                    {result.pix.payload || 'Código não disponível'}
                  </div>
                </div>
                {result.pix.expirationDate && (
                  <p className="text-xs text-slate-500 mt-3">Expira em: {result.pix.expirationDate}</p>
                )}
              </div>
            ) : null}

            {result.boleto ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                <div className="text-4xl mb-3">📄</div>
                <p className="text-slate-600 text-sm mb-4">Seu boleto foi gerado. Aprovação em até 2 dias úteis.</p>
                {result.boleto.bankSlipUrl && (
                  <a
                    href={result.boleto.bankSlipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-700 transition"
                  >
                    Baixar Boleto
                  </a>
                )}
              </div>
            ) : null}

            {result.invoiceUrl ? (
              <a href={result.invoiceUrl} target="_blank" rel="noopener noreferrer" className="block text-center text-amber-600 hover:underline text-sm">
                Ver fatura no Asaas →
              </a>
            ) : null}

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
              <strong>Atenção:</strong> A proposta será disponibilizada automaticamente após a confirmação do pagamento. Não feche esta página.
            </div>

            <Link href="/app" className="block w-full bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-200 transition text-center">
              Voltar ao painel
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PayPerUsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Carregando...</div>
      </div>
    }>
      <PayPerUseContent />
    </Suspense>
  );
}

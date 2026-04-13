'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Proposta {
  id: string;
  status: string;
  createdAt: string;
  planType: string;
}

export default function AppPage() {
  const router = useRouter();
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/propostas')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setPropostas(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white text-sm">💼</div>
            <span className="font-bold text-slate-900">Proposta Comercial</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                router.push('/login');
              }}
              className="text-slate-500 text-sm hover:text-slate-700"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Minhas Propostas</h1>
            <p className="text-slate-500 text-sm mt-1">Gerencie e acompanhe suas propostas comerciais.</p>
          </div>
          <Link href="/app/propostas/new" className="bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg transition">
            + Nova Proposta
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-slate-400">Carregando...</p>
          </div>
        ) : propostas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Nenhuma proposta ainda</h2>
            <p className="text-slate-500 text-sm mb-6">Crie sua primeira proposta comercial profissional.</p>
            <Link href="/app/propostas/new" className="inline-block bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition">
              Criar minha primeira proposta →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {propostas.map((p) => (
              <Link key={p.id} href={`/app/propostas/${p.id}`} className="block bg-white rounded-xl border border-slate-200 p-5 hover:border-amber-300 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Proposta #{p.id.slice(0, 8)}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      p.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      p.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                      p.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.status === 'draft' ? 'Rascunho' :
                       p.status === 'sent' ? 'Enviada' :
                       p.status === 'accepted' ? 'Aceita' :
                       p.status === 'rejected' ? 'Recusada' : p.status}
                    </span>
                    <span className="text-slate-400">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

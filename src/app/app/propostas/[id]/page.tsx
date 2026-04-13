'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PropostaData {
  id: string;
  templateId: string;
  status: string;
  data: string;
  createdAt: string;
}

export default function PropostaDetailPage({ params }: { params: { id: string } }) {
  const [proposta, setProposta] = useState<PropostaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/propostas/${params.id}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.ok ? r.json() : null;
      })
      .then(data => {
        if (data) setProposta(data);
      })
      .catch(() => setNotFound(true)
      )
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  if (notFound || !proposta) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🔍</div>
        <h1 className="text-xl font-bold text-slate-900">Proposta não encontrada</h1>
        <Link href="/app" className="text-amber-600 font-medium hover:underline">← Voltar ao painel</Link>
      </div>
    );
  }

  const data = proposta.data ? JSON.parse(proposta.data) : {};
  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: 'Rascunho', color: 'bg-slate-100 text-slate-600' },
    sent: { label: 'Enviada', color: 'bg-blue-100 text-blue-700' },
    accepted: { label: 'Aceita', color: 'bg-green-100 text-green-700' },
    rejected: { label: 'Recusada', color: 'bg-red-100 text-red-700' },
  };
  const status = statusLabels[proposta.status] || statusLabels.draft;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white text-sm">💼</div>
            <span className="font-bold text-slate-900">Proposta Comercial</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.color}`}>{status.label}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Proposta #{proposta.id.slice(0, 8)}</h1>
            <p className="text-slate-500 text-sm mt-1">
              Criada em {new Date(proposta.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition text-sm">
              📄 Baixar PDF
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm">
              🔗 Copiar Link
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className={`h-2 bg-gradient-to-r from-amber-600 to-orange-500`} />
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-2xl font-bold text-slate-900">{data.meuNome || 'Seu Nome'}</p>
                <p className="text-slate-500 text-sm">{data.meuEmail || 'seu@email.com'}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-sm">Proposta comercial</p>
                <p className="font-bold text-slate-900">
                  R$ {data.valor ? Number(data.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '—'}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Válida por {data.prazoDias || 7} dias
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Proposta para</p>
              <p className="font-bold text-slate-900">{data.clienteNome || 'Cliente'}</p>
              <p className="text-slate-500 text-sm">{data.clienteEmail || ''} {data.clienteCnpj ? `· ${data.clienteCnpj}` : ''}</p>
            </div>

            <div className="border-t border-slate-100 pt-6 mt-6">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Escopo do serviço</p>
              <p className="text-slate-700 whitespace-pre-wrap">{data.servico || '—'}</p>
            </div>

            <div className="border-t border-slate-100 pt-6 mt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Valor total</p>
                <p className="text-3xl font-bold text-slate-900">
                  R$ {data.valor ? Number(data.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Modelo: <strong>{proposta.templateId}</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Ações</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <button className="py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition text-sm">
              📄 Baixar PDF
            </button>
            <button className="py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition text-sm">
              🔗 Copiar Link
            </button>
            <button className="py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition text-sm">
              ✅ Marcar como Enviada
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

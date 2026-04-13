'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TEMPLATES = [
  { id: 'moderno', name: 'Moderno', desc: 'Clean e profissional', color: 'from-amber-500 to-orange-500' },
  { id: 'classico', name: 'Clássico', desc: 'Elegante e tradicional', color: 'from-slate-600 to-slate-800' },
  { id: 'minimalista', name: 'Minimalista', desc: 'Simples e direto', color: 'from-white to-slate-100' },
  { id: 'bold', name: 'Bold', desc: 'Impacto visual forte', color: 'from-red-600 to-rose-700' },
  { id: 'formal', name: 'Formal', desc: 'Para clientes corporativos', color: 'from-blue-700 to-indigo-800' },
];

export default function NewPropostaPage() {
  const router = useRouter();
  const [template, setTemplate] = useState('moderno');
  const [form, setForm] = useState({
    clienteNome: '',
    clienteEmail: '',
    clienteCnpj: '',
    meuNome: '',
    meuEmail: '',
    servico: '',
    prazoDias: '7',
    valor: '',
    validade: '',
  });
  const [saving, setSaving] = useState(false);
  const [propostaId, setPropostaId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/propostas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: template, planType: 'draft', data: form }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setPropostaId(data.id);
      }
    } finally {
      setSaving(false);
    }
  }

  if (propostaId) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 py-4">
          <div className="max-w-3xl mx-auto px-6 flex items-center gap-4">
            <Link href="/app" className="text-slate-600 hover:text-amber-600 text-sm">← Voltar</Link>
            <span className="font-bold text-slate-900">Proposta Comercial</span>
          </div>
        </header>
        <main className="max-w-md mx-auto px-6 py-16 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Proposta criada!</h1>
          <p className="text-slate-500 mb-8">Sua proposta foi salva como rascunho.</p>
          <div className="space-y-3">
            <Link href={`/app/propostas/${propostaId}`} className="block w-full py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold rounded-xl">
              Editar Proposta →
            </Link>
            <Link href="/app" className="block w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200">
              Ver Todas →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-4">
          <Link href="/app" className="text-slate-600 hover:text-amber-600 text-sm">← Voltar</Link>
          <span className="font-bold text-slate-900">Proposta Comercial</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Nova Proposta</h1>

        {/* Template Selection */}
        <div className="mb-10">
          <h2 className="font-semibold text-slate-900 mb-4">Escolha o modelo</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`rounded-xl border-2 p-4 text-center transition ${
                  template === t.id ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg mx-auto mb-2 bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-lg`}>💼</div>
                <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do cliente</label>
              <input
                type="text"
                required
                placeholder="Maria Silva"
                value={form.clienteNome}
                onChange={e => setForm({ ...form, clienteNome: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail do cliente</label>
              <input
                type="email"
                required
                placeholder="maria@empresa.com"
                value={form.clienteEmail}
                onChange={e => setForm({ ...form, clienteEmail: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ do cliente (opcional)</label>
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                value={form.clienteCnpj}
                onChange={e => setForm({ ...form, clienteCnpj: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Seu nome</label>
              <input
                type="text"
                required
                placeholder="Seu nome ou empresa"
                value={form.meuNome}
                onChange={e => setForm({ ...form, meuNome: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do serviço</label>
              <textarea
                required
                rows={3}
                placeholder="Descreva o escopo do serviço ou produto..."
                value={form.servico}
                onChange={e => setForm({ ...form, servico: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor total (R$)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="1500.00"
                value={form.valor}
                onChange={e => setForm({ ...form, valor: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Validade da proposta (dias)</label>
              <input
                type="number"
                min="1"
                placeholder="7"
                value={form.prazoDias}
                onChange={e => setForm({ ...form, prazoDias: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Criar Proposta →'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

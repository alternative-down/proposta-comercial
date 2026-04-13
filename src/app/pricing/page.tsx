import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-amber-100 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white text-sm">💼</div>
            <span className="font-bold text-slate-900">Proposta Comercial</span>
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Planos — Proposta Comercial</h1>
          <p className="text-xl text-slate-600">Uma proposta profissional por R$ 19. Ou ilimitada por R$ 49/mês.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Avulso */}
          <div className="bg-white rounded-2xl border border-amber-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Avulso</h2>
            <p className="text-slate-500 text-sm mb-4">Para começar ou para quem emite poucas propostas.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">R$ 19</span>
              <span className="text-slate-500">/proposta</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-600">
              {["1 proposta completa", "Todos os modelos", "PDF com sua marca", "Tabela de preços automática", "Link compartilhável com tracking", "Prazo de validade configurável"].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-green-500">✓</span> {f}</li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full py-3 text-center bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition">Criar proposta</Link>
          </div>
          {/* Mensal */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-300 p-8 relative">
            <span className="absolute top-4 right-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">Recomendado</span>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Mensal</h2>
            <p className="text-slate-500 text-sm mb-4">Para quem envia propostas com frequência.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">R$ 49</span>
              <span className="text-slate-500">/mês</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-slate-600">
              {["Propostas ilimitadas", "Todos os modelos", "PDF com sua marca", "Tabela de preços automática", "Link compartilhável com tracking", "Prazo de validade configurável", "Analytics de visualização", "Novos modelos a cada atualização"].map(f => (
                <li key={f} className="flex items-center gap-2"><span className="text-green-500">✓</span> {f}</li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full py-3 text-center bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition">Assinar mensal</Link>
          </div>
        </div>
        <p className="text-center text-slate-500 text-sm mt-8">Cancele quando quiser. Sem taxa de cancelamento.</p>
      </main>
    </div>
  );
}

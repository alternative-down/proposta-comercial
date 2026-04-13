import Link from "next/link";

export default function SupportPage() {
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
      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Suporte</h1>
        <p className="text-slate-600 mb-8">Precisa de ajuda? Entre em contato pelo email da Alternative Down.</p>
        <Link href="/" className="text-amber-600 hover:underline">← Voltar para home</Link>
      </main>
    </div>
  );
}

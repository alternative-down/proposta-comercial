import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">💼</div>
          <h1 className="text-2xl font-bold text-slate-900">Entrar na Proposta Comercial</h1>
          <p className="text-slate-500 mt-1">Faça login para criar suas propostas</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-100 p-8 text-center">
          <p className="text-slate-600 text-sm mb-6">Página de login em desenvolvimento.</p>
          <Link href="/" className="text-amber-600 hover:underline font-medium">← Voltar para home</Link>
        </div>
      </div>
    </div>
  );
}

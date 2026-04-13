import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center text-white text-lg">
              💼
            </div>
            <span className="font-bold text-slate-900 text-lg">Proposta Comercial</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/pricing" className="text-slate-600 hover:text-amber-600 text-sm font-medium">Preços</Link>
            <Link href="/login" className="text-slate-600 hover:text-amber-600 text-sm font-medium">Entrar</Link>
            <Link href="/signup" className="bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 text-sm">Cadastrar</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">Modelos prontos</span>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">5 minutos</span>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">PDF profissional</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Sua próxima proposta.<br />Em minutos, com cara de agência.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Gere propostas comerciais profissionais com modelos prontos, tabela de preços automática e PDF com sua marca. A partir de R$ 19.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup" className="bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg transition text-lg">
              Criar minha proposta →
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-amber-600 font-medium px-4 py-4 text-lg">
              Ver planos
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-12 text-center">
            Propostas que fecham negócios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📊", title: "Tabela de preços automática", desc: "Liste produtos e serviços com valores — a proposta calcula o total automaticamente." },
              { icon: "⏰", title: "Prazo de validade", desc: "Defina quando a proposta expira. Escassez legítima que acelera a decisão." },
              { icon: "🎨", title: "Branding completo", desc: "Sua marca, seu nome, suas cores — em cada proposta." },
              { icon: "🔗", title: "Compartilhar por link", desc: "Envie como link ou PDF — seu cliente recebe como preferir." },
              { icon: "📈", title: "Analytics de visualização", desc: "Acompanhe quem viu sua proposta e quando. Dados que ajudam a fechar." },
              { icon: "📝", title: "Modelos prontos", desc: "Vários modelos profissionais prontos para usar. Escolha, preencha e envie." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-amber-100 p-6 text-left">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-bold text-slate-900 mt-3 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="max-w-4xl mx-auto px-6 py-12 text-center">
          <p className="text-slate-500 text-sm">
            Feito para autônomos e PMEs brasileiras.
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Dúvidas frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Preciso ter CNPJ?", a: "Não. Funciona com MEI, CPF ou CNPJ — para qualquer perfil de profissional." },
              { q: "A proposta é um contrato?", a: "Não. A Proposta Comercial é um documento de intenção comercial. Para contratos formais com força jurídica, use Contrato Express." },
              { q: "Posso personalizar o design?", a: "Sim. Logo, cores e tipografia — cada proposta carrega a sua marca." },
              { q: "O cliente assina pela plataforma?", a: "A proposta pode incluir um botão de aceite. Mas para assinatura com força jurídica, use Contrato Express depois que o cliente aceitar a proposta." },
              { q: "Como o cliente recebe a proposta?", a: "Por link direto ou PDF — você escolhe. O link inclui tracking de visualização." },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-amber-100 p-5 text-left">
                <p className="font-semibold text-slate-900 mb-2">{faq.q}</p>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Sua próxima proposta pode ser diferente</h2>
          <p className="text-slate-600 mb-8">Modelos prontos. Tabela automática. PDF profissional.</p>
          <Link href="/signup" className="inline-block bg-gradient-to-r from-amber-600 to-orange-500 text-white font-bold px-10 py-4 rounded-xl hover:shadow-lg transition text-lg">
            Criar minha proposta →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-slate-500">
          <span>© 2026 Proposta Comercial — Alternative Down</span>
          <div className="flex items-center gap-4">
            <Link href="/support" className="hover:text-amber-600">Suporte</Link>
            <Link href="/pricing" className="hover:text-amber-600">Preços</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

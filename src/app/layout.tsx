import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proposta Comercial — Crie propostas profissionais em minutos",
  description: "Gere propostas comerciais profissionais com modelos prontos, tabela de preços automática e PDF com sua marca. A partir de R$ 19.",
  alternates: {
    canonical: "https://proposta.alternativedown.com.br",
  },
  openGraph: {
    title: "Proposta Comercial — Crie propostas profissionais em minutos",
    description: "Gere propostas comerciais profissionais com modelos prontos, tabela de preços automática e PDF com sua marca. A partir de R$ 19.",
    url: "https://proposta.alternativedown.com.br",
    siteName: "Proposta Comercial",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Proposta Comercial" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposta Comercial — Crie propostas profissionais em minutos",
    description: "Gere propostas comerciais profissionais com modelos prontos e PDF com sua marca. A partir de R$ 19.",
  },
  robots: { index: true, follow: true },
  other: {
    "application/ld+json": JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Proposta Comercial",
        description: "Gere propostas comerciais profissionais com modelos prontos, tabela de preços automática e PDF com sua marca. A partir de R$ 19.",
        url: "https://proposta.alternativedown.com.br",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "19",
          priceCurrency: "BRL",
          description: "A partir de R$ 19",
        },
        provider: {
          "@type": "Organization",
          name: "Alternative Down",
          url: "https://alternativedown.com.br",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Preciso ter CNPJ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Não. Funciona com MEI, CPF ou CNPJ — para qualquer perfil de profissional.",
            },
          },
          {
            "@type": "Question",
            name: "A proposta é um contrato?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Não. A Proposta Comercial é um documento de intenção comercial. Para contratos formais com força jurídica, use Contrato Express.",
            },
          },
          {
            "@type": "Question",
            name: "Posso personalizar o design?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim. Logo, cores e tipografia — cada proposta carrega a sua marca.",
            },
          },
          {
            "@type": "Question",
            name: "O cliente assina pela plataforma?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A proposta pode incluir um botão de aceite. Para assinatura com força jurídica, use Contrato Express depois que o cliente aceitar a proposta.",
            },
          },
          {
            "@type": "Question",
            name: "Como o cliente recebe a proposta?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Por link direto ou PDF — você escolhe. O link inclui tracking de visualização.",
            },
          },
        ],
      },
    ]),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 antialiased">{children}</body>
    </html>
  );
}

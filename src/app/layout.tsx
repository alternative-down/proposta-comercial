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
  openGraph: {
    title: "Proposta Express — Propostas profissionais em minutos",
    description: "Gere propostas comerciais com modelos prontos, tabela de preços automática e PDF com sua marca.",
    url: "https://proposta.alternativedown.com.br",
    siteName: "Proposta Express",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Proposta Express" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposta Express — Propostas profissionais em minutos",
    description: "Gere propostas comerciais com modelos prontos e PDF com sua marca.",
  },
  robots: { index: true, follow: true },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Proposta Express",
      description: "Gere propostas comerciais profissionais com modelos prontos, tabela de preços automática e PDF com sua marca.",
      url: "https://proposta.alternativedown.com.br",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "19",
        priceCurrency: "BRL",
        description: "A partir de R$ 19/proposta",
      },
      provider: {
        "@type": "Organization",
        name: "Alternative Down",
        url: "https://alternativedown.com.br",
      },
    }),
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

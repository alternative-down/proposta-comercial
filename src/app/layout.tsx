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

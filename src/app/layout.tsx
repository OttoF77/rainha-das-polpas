import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sites.sysotto.com/rainhadaspolpas";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rainha das Polpas | O sabor puro da fruta direto para sua casa",
  description:
    "Polpas de frutas 100% naturais, sem conservantes e ultracongeladas. Catálogo com 13 sabores autênticos. Peça direto no WhatsApp (88) 99709-9082.",
  keywords: [
    "polpas de frutas",
    "polpa natural",
    "Rainha das Polpas",
    "polpa congelada",
    "mangaba",
    "caju",
    "acerola",
    "cajá",
    "graviola",
    "seriguela",
    "Ceará",
    "sucos naturais",
  ],
  authors: [{ name: "Sysotto Softwares", url: "https://sysotto.com" }],
  creator: "Sysotto Softwares",
  publisher: "Rainha das Polpas",
  openGraph: {
    title: "Rainha das Polpas | 100% Fruta Natural",
    description: "Polpas de frutas ultracongeladas sem conservantes. 13 sabores deliciosos direto para sua mesa.",
    url: siteUrl,
    siteName: "Rainha das Polpas",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: `${basePath}/images/logo.png`,
        width: 800,
        height: 600,
        alt: "Rainha das Polpas",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  "name": "Rainha das Polpas",
  "image": `${siteUrl}/images/logo.png`,
  "telephone": "+55-88-99709-9082",
  "url": siteUrl,
  "servesCuisine": "Polpas de Frutas Naturais",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "CE",
    "addressCountry": "BR",
  },
  "description":
    "Polpas de frutas 100% naturais, sem conservantes e com o máximo de sabor e nutrientes. Distribuição regional em pacotes de 1kg fracionados em 10x100g.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fcfbfa] text-[#0A2540] antialiased">
        {children}
      </body>
    </html>
  );
}

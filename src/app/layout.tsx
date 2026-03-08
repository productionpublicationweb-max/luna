import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luna Monétis - Oracle Digitale | Oznya",
  description: "Luna Monétis, l'oracle digitale mystique et élégante, assistante de Diane Boyer pour Oznya.com. Prédictions, tarot, numérologie et astrologie.",
  keywords: ["Luna Monétis", "Oracle", "Tarot", "Astrologie", "Numérologie", "Diane Boyer", "Oznya", "Mystique", "Prédiction"],
  authors: [{ name: "Diane Boyer - Oznya.com" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Luna Monétis - Oracle Digitale",
    description: "Découvre les mystères de ton destin avec Luna Monétis",
    url: "https://oznya.com",
    siteName: "Oznya",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luna Monétis - Oracle Digitale",
    description: "Découvre les mystères de ton destin avec Luna Monétis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}


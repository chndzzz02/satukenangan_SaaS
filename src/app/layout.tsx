import type { Metadata } from "next";
import { Fraunces, Inter, Space_Mono, Caveat } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "satukenangan — Kamera Sekali Pakai Digital untuk Acara",
  description:
    "Ubah acara pernikahan, ulang tahun, dan pesta menjadi petualangan foto analog. Foto bersama, rasakan nostalgia nunggu hasil cuci film!",
  keywords: ["satukenangan", "kamera sekali pakai digital", "disposable camera web app", "foto pernikahan", "digital wedding photo album"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fraunces.variable} ${inter.variable} ${spaceMono.variable} ${caveat.variable} scroll-smooth`}
    >
      <body className="bg-cream text-ink font-ui antialiased relative min-h-screen">
        {/* Subtle Film Grain Overlay */}
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

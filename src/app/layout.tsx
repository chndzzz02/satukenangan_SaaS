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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "satukenangan — Kamera Sekali Pakai Digital untuk Acara Spesial",
    template: "%s | satukenangan",
  },
  description:
    "Ubah acara pernikahan, pesta ulang tahun, gathering kantor, dan wisuda menjadi kenangan foto analog retro. Tamu memotret tanpa instal aplikasi, foto dikunci lalu dibuka bersama!",
  keywords: [
    "satukenangan",
    "kamera sekali pakai digital",
    "disposable camera web app",
    "foto pernikahan",
    "buku tamu digital",
    "wedding photo album",
    "event camera app",
    "kamera analog digital",
  ],
  authors: [{ name: "Satukenangan Team" }],
  openGraph: {
    title: "satukenangan — Kamera Sekali Pakai Digital untuk Acara Spesial",
    description:
      "Abadikan momen acara Anda dengan sensasi cuci film kamera sekali pakai. Bebas jepret via QR Code!",
    url: siteUrl,
    siteName: "satukenangan",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Satukenangan Disposable Camera App",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "satukenangan — Kamera Sekali Pakai Digital untuk Acara Spesial",
    description:
      "Ubah acara pernikahan & pesta Anda menjadi album foto analog retro digital.",
    images: ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
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

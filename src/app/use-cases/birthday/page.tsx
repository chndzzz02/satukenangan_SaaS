import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShutterButton from "@/components/ShutterButton";
import Link from "next/link";
import { Gift, Sparkles, Camera, PartyPopper } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kamera Sekali Pakai untuk Pesta Ulang Tahun & Party",
  description: "Ubah pesta ulang tahun Anda menjadi lebih seru dengan kamera disposable digital retro. Tamu bebas memotret dari sudut mana saja!",
};

export default function BirthdayUseCasePage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <Navbar />

      <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-amber-300">
            <Gift size={14} className="text-amber-600" /> PESTA ULANG TAHUN & CELEBRATION
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-ink mb-6 leading-tight">
            Pesta Ulang Tahun Makin Seru dengan <span className="text-terracotta">Disposable Camera Roll</span>
          </h1>
          <p className="font-ui text-base sm:text-xl text-ink/75 leading-relaxed">
            Biarkan teman-teman terbaik Anda mengabadikan momen candid terseru dari pesta ulang tahun Anda dengan efek kamera film retro!
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/create">
              <ShutterButton label="Buat Roll Ulang Tahun Gratis" size="large" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

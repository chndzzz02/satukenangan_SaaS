import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShutterButton from "@/components/ShutterButton";
import Link from "next/link";
import { Users, Sparkles, Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kamera Sekali Pakai untuk Gathering Kantor & Event Komunitas",
  description: "Dokumentasi event kantor, outing, dan gathering komunitas lebih akrab dengan kamera sekali pakai digital.",
};

export default function GatheringUseCasePage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <Navbar />

      <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-300">
            <Building2 size={14} className="text-emerald-700" /> GATHERING KANTOR & KOMUNITAS
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-ink mb-6 leading-tight">
            Dokumentasi Event Kantor & Outing Lebih <span className="text-terracotta">Akrab & Menyenangkan</span>
          </h1>
          <p className="font-ui text-base sm:text-xl text-ink/75 leading-relaxed">
            Libatkan seluruh peserta acara untuk memotret dari sudut pandang mereka masing-masing. Hasil foto siap diunduh dalam format .ZIP oleh panitia!
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/create">
              <ShutterButton label="Buat Roll Gathering Gratis" size="large" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

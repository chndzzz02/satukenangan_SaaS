import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShutterButton from "@/components/ShutterButton";
import Link from "next/link";
import { GraduationCap, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kamera Sekali Pakai untuk Wisuda & Perayaan Kelulusan",
  description: "Abadikan perayaan kelulusan dan wisuda bersama sahabat terbaik dengan kamera sekali pakai digital.",
};

export default function GraduationUseCasePage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <Navbar />

      <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-900 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-blue-300">
            <GraduationCap size={14} className="text-blue-700" /> WISUDA & KELULUSAN
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-ink mb-6 leading-tight">
            Perayaan Wisuda & Momen Kelulusan <span className="text-terracotta">Penuh Nostalgia</span>
          </h1>
          <p className="font-ui text-base sm:text-xl text-ink/75 leading-relaxed">
            Momen kelulusan bersama sahabat tidak terjadi dua kali. Jepret foto-foto kebersamaan dengan nuansa film analog retro.
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/create">
              <ShutterButton label="Buat Roll Wisuda Gratis" size="large" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

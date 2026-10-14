import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShutterButton from "@/components/ShutterButton";
import Link from "next/link";
import { Heart, Sparkles, Camera, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kamera Sekali Pakai untuk Pernikahan & Resepsi Wedding",
  description: "Sensasi kamera disposable analog retro untuk resepsi pernikahan Anda. Tamu scan QR Code, ambil foto bersama, dan foto dibuka bersama saat acara berakhir!",
};

export default function WeddingUseCasePage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <Navbar />

      <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-rose-300">
            <Heart size={14} className="fill-rose-500 text-rose-500" /> PERNIKAHAN & RESEPSI WEDDING
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-ink mb-6 leading-tight">
            Abadikan Momen Pernikahan dengan Sensasi <span className="text-terracotta">Kamera Analog Retro</span>
          </h1>
          <p className="font-ui text-base sm:text-xl text-ink/75 leading-relaxed">
            Berikan tamu undangan Anda pengalaman memotret yang seru dan berkesan. Tanpa perlu unduh aplikasi, tamu cukup memindai QR Code di meja resepsi!
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/create">
              <ShutterButton label="Buat Roll Pernikahan Gratis" size="large" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-paper p-6 rounded-3xl border border-line shadow-lg">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mb-4">
              <Camera size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-ink mb-2">QR Code Meja Resepsi</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Cetak QR Code cantik untuk diletakkan di setiap meja tamu. Tamu cukup buka kamera HP dan langsung memotret!
            </p>
          </div>

          <div className="bg-paper p-6 rounded-3xl border border-line shadow-lg">
            <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-ink mb-2">Delayed Reveal Event</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Hasil foto tidak langsung muncul! Foto dikunci hingga waktu reveal acara (misal: jam 9 malam), memberikan kejutan menyenangkan saat dibuka bersama.
            </p>
          </div>

          <div className="bg-paper p-6 rounded-3xl border border-line shadow-lg">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-ink mb-2">Moderasi Foto Lengkap</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Host pernikahan memegang kontrol penuh untuk melihat, menyembunyikan, atau mendownload seluruh album foto resolusi tinggi.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

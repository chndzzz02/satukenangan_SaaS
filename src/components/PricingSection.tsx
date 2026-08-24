"use client";

import { useState } from "react";
import ShutterButton from "./ShutterButton";
import { Check, Film, Sparkles, Zap, ShieldCheck } from "lucide-react";

interface GuestTier {
  guests: string;
  guestNum: number;
  price: number;
  isFree: boolean;
  features: string[];
}

const TIERS: GuestTier[] = [
  {
    guests: "5 Tamu",
    guestNum: 5,
    price: 0,
    isFree: true,
    features: [
      "Gratis hingga 5 Tamu",
      "24 Foto per Tamu",
      "Akses Download Galeri HD",
      "Pilihan 2 Preset Film",
      "Berlaku 7 Hari",
    ],
  },
  {
    guests: "50 Tamu",
    guestNum: 50,
    price: 149000,
    isFree: false,
    features: [
      "Hingga 50 Tamu Acara",
      "24 Foto per Tamu",
      "Galeri Web Interaktif + Countdown",
      "Akses Semua 6 Preset Film",
      "QR Code Siap Cetak (PDF & PNG)",
      "Penyimpanan Foto 1 Tahun",
    ],
  },
  {
    guests: "100 Tamu",
    guestNum: 100,
    price: 279000,
    isFree: false,
    features: [
      "Hingga 100 Tamu Acara",
      "36 Foto per Tamu",
      "Semua Fitur Paket 50 Tamu",
      "Live Slideshow Proyektor Resepsi",
      "Custom Subtitle & Branding Acara",
      "Download Zip Semua Foto HD",
    ],
  },
  {
    guests: "200 Tamu",
    guestNum: 200,
    price: 449000,
    isFree: false,
    features: [
      "Hingga 200 Tamu Acara",
      "Foto Tanpa Batas per Tamu",
      "Semua Fitur Paket 100 Tamu",
      "Prioritas Pemrosesan Cuci Film",
      "Support VIP WhatsApp",
      "Penyimpanan Foto Permanen",
    ],
  },
  {
    guests: "Unlimited (∞)",
    guestNum: 999,
    price: 799000,
    isFree: false,
    features: [
      "Jumlah Tamu Tanpa Batas",
      "Foto Tanpa Batas per Tamu",
      "Semua Fitur VIP Premium",
      "Domain Custom (misal: dimas-nisa.com)",
      "Laporan Analitik Foto Tamu",
      "Penyimpanan Foto Permanen",
    ],
  },
];

export default function PricingSection() {
  const [tierIndex, setTierIndex] = useState(1); // Default to 50 guests

  const currentTier = TIERS[tierIndex];

  const formatRupiah = (amount: number) => {
    if (amount === 0) return "GRATIS";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section id="harga" className="py-24 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-moss uppercase tracking-widest bg-sand px-3 py-1 rounded-full">
            INVESTASI ACARA
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink mt-3 mb-4">
            Harga transparan, <span className="text-terracotta">tanpa biaya tersembunyi</span>
          </h2>
          <p className="font-ui text-base sm:text-lg text-ink/70">
            Geser roll film counter di bawah untuk menyesuaikan paket sesuai estimasi jumlah tamu acaramu.
          </p>
        </div>

        {/* Tactile Analog Film Roll Slider Box */}
        <div className="max-w-3xl mx-auto bg-paper p-8 rounded-3xl border border-line shadow-2xl mb-12">
          {/* Film Strip Header Visual */}
          <div className="flex items-center justify-between font-mono text-xs text-ink/70 mb-6 pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-terracotta" />
              <span className="font-bold">FILM ROLL FRAME DIAL</span>
            </div>
            <span>EXPOSURE SELECTOR</span>
          </div>

          {/* Slider Guest Number Labels */}
          <div className="flex justify-between items-center mb-4">
            {TIERS.map((tier, idx) => (
              <button
                key={tier.guests}
                onClick={() => setTierIndex(idx)}
                className={`font-mono text-xs sm:text-sm font-bold transition-all px-2.5 py-1 rounded-lg ${
                  tierIndex === idx
                    ? "bg-terracotta text-paper scale-110 shadow-sm"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {tier.guests}
              </button>
            ))}
          </div>

          {/* Custom Film Frame Range Slider */}
          <div className="relative my-6 px-2">
            <input
              type="range"
              min="0"
              max={TIERS.length - 1}
              step="1"
              value={tierIndex}
              onChange={(e) => setTierIndex(parseInt(e.target.value))}
              className="w-full h-4 bg-sand rounded-lg appearance-none cursor-pointer accent-terracotta border border-line"
            />
          </div>

          {/* Price Display Container */}
          <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-moss uppercase tracking-wider">
                  Kapasitas Roll:
                </span>
                <span className="font-mono font-bold text-ink bg-sand px-2.5 py-0.5 rounded text-sm">
                  {currentTier.guests}
                </span>
                {currentTier.isFree && (
                  <span className="bg-mustard text-ink font-mono font-bold text-xs px-3 py-1 rounded-full border border-ink/20 shadow-sm animate-bounce">
                    ★ GRATIS UJI COBA
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl font-bold text-ink">
                  {formatRupiah(currentTier.price)}
                </span>
                {!currentTier.isFree && (
                  <span className="font-mono text-xs text-moss">/ 1 kali acara</span>
                )}
              </div>
            </div>

            <ShutterButton
              label={currentTier.isFree ? "Mulai Gratis Now" : "Pilih Paket Ini"}
              size="large"
            />
          </div>
        </div>

        {/* Feature List Grid for Selected Tier */}
        <div className="max-w-3xl mx-auto bg-cream p-6 rounded-2xl border border-line">
          <h4 className="font-display font-bold text-ink text-base mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-moss stroke-[3]" />
            <span>Fasilitas Termasuk Dalam Paket ({currentTier.guests}):</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentTier.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm text-ink/80 font-ui">
                <div className="w-4 h-4 rounded-full bg-moss/20 text-moss flex items-center justify-center text-[10px] shrink-0">
                  ✓
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

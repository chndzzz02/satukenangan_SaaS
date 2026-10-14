"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface Preset {
  id: string;
  name: string;
  code: string;
  tagline: string;
  gradient: string;
  styleObj: React.CSSProperties;
  sampleImg: string;
  toneDesc: string;
}

const PRESETS: Preset[] = [
  {
    id: "portra400",
    name: "Portra 400",
    code: "ISO 400 • COLOR",
    tagline: "Warm Skin Tones & Pastel Soft",
    gradient: "from-amber-200 via-orange-300 to-rose-200",
    styleObj: {
      filter: "sepia(0.2) contrast(1.08) saturate(1.2) hue-rotate(-5deg)",
    },
    sampleImg: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    toneDesc: "Tone paling populer untuk resepsi wedding: warna kulit hangat dan warna pastel lembut.",
  },
  {
    id: "cinestill800t",
    name: "CineStill 800T",
    code: "ISO 800 • TUNGSTEN",
    tagline: "Night Glow & Halation Red",
    gradient: "from-blue-600 via-indigo-500 to-red-500",
    styleObj: {
      filter: "contrast(1.2) hue-rotate(15deg) saturate(1.3) brightness(0.95)",
    },
    sampleImg: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    toneDesc: "Sangat estetis untuk pesta malam hari, memberi efek glow neon pada lampu resepsi.",
  },
  {
    id: "funsaver",
    name: "FunSaver Disposable",
    code: "ISO 800 • VINTAGE",
    tagline: "Nostalgic Yellow & Grainy",
    gradient: "from-yellow-400 via-amber-500 to-red-400",
    styleObj: {
      filter: "sepia(0.35) contrast(1.15) saturate(1.25) brightness(1.05)",
    },
    sampleImg: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80",
    toneDesc: "Meniru persis kamera sekali pakai minimarket legendaris dengan nuansa kuning nostalgia.",
  },
  {
    id: "quicksnap",
    name: "QuickSnap Green",
    code: "ISO 400 • FUJI TONE",
    tagline: "Cool Shadows & Lush Greens",
    gradient: "from-emerald-400 via-teal-500 to-amber-300",
    styleObj: {
      filter: "hue-rotate(-12deg) contrast(1.1) saturate(1.15) brightness(1.02)",
    },
    sampleImg: "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=600&q=80",
    toneDesc: "Ideal untuk venue outdoor & garden party, menonjolkan warna daun hijau dan kontras sejuk.",
  },
  {
    id: "hp5plus",
    name: "HP5 Plus Monochrome",
    code: "ISO 400 • B&W",
    tagline: "Classic Black & White",
    gradient: "from-slate-700 via-gray-500 to-gray-200",
    styleObj: {
      filter: "grayscale(100%) contrast(1.3) brightness(1.05)",
    },
    sampleImg: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    toneDesc: "Hitam putih klasik dengan kontras tegas. Abadi dan elegan untuk momen emosional.",
  },
  {
    id: "ektar100",
    name: "Ektar 100 Punchy",
    code: "ISO 100 • HIGH SAT",
    tagline: "Vibrant Color & Rich Contrast",
    gradient: "from-orange-500 via-rose-600 to-yellow-300",
    styleObj: {
      filter: "saturate(1.6) contrast(1.2) brightness(1.02)",
    },
    sampleImg: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
    toneDesc: "Warna yang kaya dan berani. Menjadikan gaun dan dekorasi bunga tampak menyala tajam.",
  },
];

export default function FilmPresetsSection() {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);

  return (
    <section id="preset-film" className="py-24 bg-paper relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-moss uppercase tracking-widest bg-sand/80 px-3.5 py-1 rounded-full font-bold">
            KATALOG FILM ROLL ANALOG
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink mt-3 mb-4">
            6 Pilihan Emulasi <span className="text-terracotta">Film Analog</span>
          </h2>
          <p className="font-ui text-base sm:text-lg text-ink/70">
            Arahkan kursor atau ketuk kartu preset untuk melihat simulasi efek warna film secara langsung!
          </p>
        </div>

        {/* Live Filter Showcase Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Big Live Preview Window (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="polaroid-frame w-full max-w-sm bg-cream p-4 border border-line shadow-2xl relative rounded-2xl">
              <div className="flex items-center justify-between font-mono text-xs text-ink/80 mb-2">
                <span className="font-bold text-terracotta flex items-center gap-1">
                  <Sparkles size={14} /> PREVIEW LIVE
                </span>
                <span className="bg-amber-100 border border-amber-300 text-amber-900 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                  {activePreset.code}
                </span>
              </div>

              {/* Dynamic Filter Applied Photo */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-ink shadow-inner">
                <Image
                  src={activePreset.sampleImg}
                  alt={activePreset.name}
                  fill
                  style={activePreset.styleObj}
                  className="object-cover transition-all duration-500 ease-out"
                />
                <div className="absolute bottom-3 right-3 font-mono text-amber-300 text-xs font-bold tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  &apos;26 08 24
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line text-center">
                <h3 className="font-display text-2xl font-bold text-ink">
                  {activePreset.name}
                </h3>
                <p className="font-ui text-xs font-semibold text-terracotta mt-0.5">
                  {activePreset.tagline}
                </p>
                <p className="font-ui text-xs text-ink/70 mt-2 leading-relaxed">
                  {activePreset.toneDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Swatch Selection Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRESETS.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <motion.div
                  key={preset.id}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => setActivePreset(preset)}
                  onClick={() => setActivePreset(preset)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-cream border-terracotta shadow-md"
                      : "bg-paper hover:bg-cream/40 border-line"
                  }`}
                >
                  {/* Color Strip Gradient */}
                  <div
                    className={`h-2.5 w-full rounded-full bg-gradient-to-r ${preset.gradient} mb-3 shadow-inner`}
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-mono text-sm font-bold text-ink flex items-center gap-1.5">
                        {preset.name}
                        {isSelected && (
                          <Check className="w-4 h-4 text-terracotta stroke-[3]" />
                        )}
                      </h4>
                      <p className="font-mono text-[10px] text-moss mt-0.5">
                        {preset.code}
                      </p>
                    </div>

                    <span className="font-mono text-[10px] px-2 py-1 bg-sand rounded-lg text-ink/80 border border-line font-bold">
                      PREVIEW
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

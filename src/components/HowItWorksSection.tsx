"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Sparkles, Eye, Camera, CheckCircle2, ArrowRight } from "lucide-react";
import Image from "next/image";

interface Step {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  icon: any;
  frameCode: string;
  mockupState: {
    title: string;
    description: string;
    images: string[];
    badge: string;
  };
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Buat Acara & Pilih Roll",
    subtitle: "Hanya butuh 2 menit untuk setting",
    desc: "Tentukan nama acara (misal: Wedding Dimas & Nisa), kuota foto per tamu, dan pilih preset filter khas film pilihanmu.",
    icon: Camera,
    frameCode: "01 / STEP",
    mockupState: {
      title: "Pernikahan Nisa & Dimas",
      description: "Preset Roll: Portra 400 â€¢ 24 Foto/Tamu",
      images: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80",
      ],
      badge: "Roll Dibuat",
    },
  },
  {
    id: 2,
    title: "Cetak & Cetakkan QR Code",
    subtitle: "Tamu tinggal scan tanpa perlu download app",
    desc: "Cetak QR Code di meja tamu atau tampilkan di layar utama acara. Tamu cukup scan pakai kamera HP dan langsung siap jepret!",
    icon: QrCode,
    frameCode: "02 / STEP",
    mockupState: {
      title: "Scan & Jepret Momen!",
      description: "21 Foto Tersisa di Kamera Tamu",
      images: [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=80",
      ],
      badge: "QR Aktif",
    },
  },
  {
    id: 3,
    title: "Ungkap Bersama (The Reveal)",
    subtitle: "Sensasi nunggu foto 'dicuci' dan buka bareng!",
    desc: "Foto tidak langsung muncul! Begitu hitung mundur selesai, semua foto dari seluruh tamu 'dicuci' sekaligus dan terbuka bersama dalam galeri analog.",
    icon: Eye,
    frameCode: "03 / STEP",
    mockupState: {
      title: "Roll Selesai Dicuci! ðŸŽ‰",
      description: "142 Foto Berhasil Terkumpul",
      images: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
      ],
      badge: "100% Revealed",
    },
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(1);

  const currentStep = STEPS.find((s) => s.id === activeStep) || STEPS[0];

  return (
    <section id="cara-kerja" className="py-24 bg-paper relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand text-moss font-mono text-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>ALUR INTERAKTIF</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink mb-4 leading-tight">
            Bagaimana <span className="text-terracotta">satukenangan</span> bekerja?
          </h2>
          <p className="font-ui text-base sm:text-lg text-ink/70">
            Tanpa perlu instal aplikasi tambahan. Menggabungkan kemudahan HP modern dengan nostalgia keseruan kamera analog sekali pakai.
          </p>
        </div>

        {/* Scrollytelling / Interactive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Steps Selector (Left 7 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-cream border-terracotta shadow-md scale-[1.02]"
                      : "bg-paper hover:bg-cream/50 border-line"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Number Circle */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg shrink-0 transition-colors ${
                        isActive
                          ? "bg-terracotta text-paper shadow-md"
                          : "bg-sand text-ink/70"
                      }`}
                    >
                      0{step.id}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                          {step.title}
                          {isActive && (
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-mustard/30 text-ink">
                              AKTIF
                            </span>
                          )}
                        </h3>
                        <span className="font-mono text-xs text-moss">
                          {step.frameCode}
                        </span>
                      </div>
                      <p className="font-ui text-sm font-semibold text-terracotta mb-2">
                        {step.subtitle}
                      </p>
                      <p className="font-ui text-sm text-ink/70 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Phone Mockup Showcase (Right 6 Cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              {/* Camera Frame Decor */}
              <div className="absolute -top-4 -left-4 font-mono text-[10px] text-ink/40 tracking-widest">
                SCREEN STATE // 0{activeStep}
              </div>

              {/* Phone Container */}
              <div className="bg-ink p-4 rounded-[40px] shadow-2xl border-4 border-sand/40 relative">
                {/* Speaker Notch */}
                <div className="w-28 h-4 bg-black rounded-full mx-auto mb-4" />

                {/* Inner Screen */}
                <div className="bg-cream rounded-[28px] p-5 min-h-[480px] flex flex-col justify-between overflow-hidden border border-line relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                      className="h-full flex flex-col justify-between"
                    >
                      {/* Screen Header */}
                      <div>
                        <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                          <span className="font-display font-bold text-sm text-ink flex items-center gap-1.5">
                            âœ¦ satukenangan
                          </span>
                          <span className="font-mono text-[10px] bg-terracotta text-paper px-2 py-0.5 rounded-full font-bold">
                            {currentStep.mockupState.badge}
                          </span>
                        </div>

                        <h4 className="font-display text-lg font-bold text-ink">
                          {currentStep.mockupState.title}
                        </h4>
                        <p className="font-mono text-xs text-moss mt-0.5 mb-4">
                          {currentStep.mockupState.description}
                        </p>
                      </div>

                      {/* Screen Image Display Area */}
                      <div className="my-auto py-2">
                        {activeStep === 3 ? (
                          /* Step 3 Reveal Stagger Animation */
                          <div className="grid grid-cols-2 gap-2">
                            {currentStep.mockupState.images.map((imgUrl, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, filter: "blur(12px) brightness(1.8)", scale: 0.8 }}
                                animate={{ opacity: 1, filter: "blur(0px) brightness(1)", scale: 1 }}
                                transition={{
                                  duration: 0.6,
                                  delay: idx * 0.15,
                                  ease: "easeOut",
                                }}
                                className="polaroid-frame !p-1.5 bg-paper rounded"
                              >
                                <div className="relative aspect-square w-full rounded overflow-hidden">
                                  <Image
                                    src={imgUrl}
                                    alt="Revealed photo"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-mono text-[8px] text-ink/60 block text-center mt-1">
                                  FRAME #{idx + 1}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          /* Step 1 & 2 Single Preview */
                          <div className="polaroid-frame !p-2 bg-paper rounded shadow-md">
                            <div className="relative aspect-[4/3] w-full rounded overflow-hidden">
                              <Image
                                src={currentStep.mockupState.images[0]}
                                alt="Step preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-ink/70">
                              <span>CAMERA DISPOSABLE</span>
                              <span className="text-terracotta">24 EXP LEFT</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Screen Action Button */}
                      <div className="pt-4 border-t border-line">
                        <button type="button" onClick={() => { window.location.href = "/create"; }} className="w-full py-2.5 bg-terracotta text-paper rounded-xl font-ui text-xs font-bold shadow flex items-center justify-center gap-2">
                          <Camera className="w-3.5 h-3.5" />
                          <span>
                            {activeStep === 1
                              ? "Aktifkan Acara"
                              : activeStep === 2
                              ? "Simpan & Cetak QR"
                              : "Buka Galeri Foto Acara"}
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


"use client";

import { motion } from "framer-motion";
import { ArrowRight, Camera, Check, Clock3, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const photos = [
  ["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85", "Pernikahan Emma & Noah"],
  ["https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85", "Malam yang tidak diulang"],
  ["https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=85", "Tawa teman-teman"],
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-terracotta/15 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-moss/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[.18em] text-terracotta shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> digital disposable camera
          </div>

          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[.98] tracking-tight text-ink sm:text-7xl">
            Momen terbaik tidak harus langsung <span className="text-terracotta">terlihat.</span>
          </h1>

          <p className="mt-7 max-w-xl font-ui text-lg leading-relaxed text-ink/75 sm:text-xl">
            Buat kamera sekali pakai digital untuk acara kamu. Tamu memotret, foto dikunci, lalu semua dibuka bersama setelah roll selesai dicuci.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/create"
              className="group flex items-center justify-center gap-3 rounded-2xl bg-ink px-8 py-4 font-ui font-bold text-paper transition hover:bg-terracotta shadow-xl hover:shadow-2xl"
            >
              Buat album gratis <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#cara-kerja"
              className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-paper/80 backdrop-blur-md px-7 py-4 font-ui font-semibold text-ink transition hover:border-terracotta shadow-sm"
            >
              Lihat cara kerja
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] font-bold uppercase tracking-wide text-moss">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-terracotta" /> Gratis 5 tamu</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-terracotta" /> Tanpa aplikasi</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-terracotta" /> Reveal bersama</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-5 -top-5 z-10 rounded-2xl border border-line bg-paper/90 backdrop-blur-md p-4 shadow-xl sm:-left-8"
          >
            <Camera className="mb-2 h-5 w-5 text-terracotta" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/50">Roll status</p>
            <p className="font-display text-xl font-bold text-ink">Disimpan dulu</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 rounded-[2rem] border border-line bg-paper p-3.5 shadow-2xl rotate-1">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-sand">
              <Image src={photos[0][0]} alt={photos[0][1]} fill className="object-cover" sizes="(max-width: 1024px) 90vw, 500px" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-paper/90 backdrop-blur-md px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase text-ink shadow">
                Frame 01A · Portra 400
              </span>
            </div>
            {photos.slice(1).map(([src, alt]) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-2xl">
                <Image src={src} alt={alt} fill className="object-cover" sizes="240px" />
              </div>
            ))}
          </div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-5 -right-4 rounded-2xl bg-ink px-5 py-4 text-paper shadow-2xl sm:-right-8"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-paper/60">
              <Clock3 className="h-3.5 w-3.5 text-amber-400" /> reveal timer
            </div>
            <p className="mt-1 font-display text-2xl font-bold">Setelah acara</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

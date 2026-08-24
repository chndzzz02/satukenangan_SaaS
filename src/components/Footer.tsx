"use client";

import Link from "next/link";
import { Camera, Heart, Instagram, Mail, Globe, Shield, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dusk-blue text-paper pt-16 pb-12 border-t border-dusk-blue-light relative overflow-hidden">
      {/* Decorative CineStill 800T Frame Indicator */}
      <div className="absolute top-4 left-6 font-mono text-[10px] text-paper/30 tracking-widest pointer-events-none select-none">
        CINESTILL 800T • NIGHT FRAME #36 • END OF ROLL
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-paper/15">
          {/* Brand Col (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-terracotta text-paper flex items-center justify-center shadow-md">
                <Camera className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-paper">
                ✦ satukenangan
              </span>
            </Link>

            <p className="font-ui text-sm text-paper/80 leading-relaxed max-w-sm">
              Platform kamera sekali pakai digital untuk pernikahan dan acara spesial. Menghadirkan kembali kehangatan, keautentikan, dan kebersamaan di era digital.
            </p>

            <div className="flex items-center gap-3 font-mono text-xs text-mustard pt-2">
              <Sparkles className="w-4 h-4 text-mustard" />
              <span>&ldquo;Momen ini terlalu berharga untuk satu kamera.&rdquo;</span>
            </div>
          </div>

          {/* Nav Links Col (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-mono text-xs text-mustard uppercase tracking-widest font-bold">
              NAVIGASI HARI
            </h4>
            <ul className="flex flex-col gap-2 font-ui text-sm text-paper/80">
              <li>
                <a href="#cara-kerja" className="hover:text-mustard transition-colors">
                  Cara Kerja Scrollytelling
                </a>
              </li>
              <li>
                <a href="#preset-film" className="hover:text-mustard transition-colors">
                  Katalog Preset Film Analog
                </a>
              </li>
              <li>
                <a href="#testimoni" className="hover:text-mustard transition-colors">
                  Galeri & Testimoni Host
                </a>
              </li>
              <li>
                <a href="#harga" className="hover:text-mustard transition-colors">
                  Kapasitas Guest & Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-mustard transition-colors">
                  FAQ & Bantuan
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Badges & Trust (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h4 className="font-mono text-xs text-mustard uppercase tracking-widest font-bold">
              PEMBAYARAN AMAN & TERPERCAYA
            </h4>
            <p className="font-ui text-xs text-paper/70">
              Dukungan pembayaran otomatis 24/7 melalui Midtrans Payment Gateway:
            </p>

            {/* Payment Partner Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-paper/10 border border-paper/20 rounded px-2.5 py-1.5 text-center font-mono text-xs font-bold text-paper">
                QRIS
              </div>
              <div className="bg-paper/10 border border-paper/20 rounded px-2.5 py-1.5 text-center font-mono text-xs font-bold text-paper">
                GoPay
              </div>
              <div className="bg-paper/10 border border-paper/20 rounded px-2.5 py-1.5 text-center font-mono text-xs font-bold text-paper">
                BCA / Mandiri
              </div>
              <div className="bg-paper/10 border border-paper/20 rounded px-2.5 py-1.5 text-center font-mono text-xs font-bold text-paper">
                ShopeePay
              </div>
              <div className="bg-paper/10 border border-paper/20 rounded px-2.5 py-1.5 text-center font-mono text-xs font-bold text-paper">
                Visa / MC
              </div>
              <div className="bg-paper/10 border border-paper/20 rounded px-2.5 py-1.5 text-center font-mono text-xs font-bold text-paper">
                Midtrans
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-paper/60">
          <p>© 2026 satukenangan. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
            <span>for warm memories & happy stories.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

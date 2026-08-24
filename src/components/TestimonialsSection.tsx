"use client";

import Image from "next/image";
import { Star, Award, Image as ImageIcon, Heart, CheckCircle } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  photo: string;
  quote: string;
  event: string;
  rotation: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Aditya & Clarissa",
    role: "Pernikahan di Bandung",
    photo: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
    quote: "Sensasi nunggu foto dibuka seru banget! Teman-teman kita pada antusias pas momen countdown selesai. Foto-fotonya alami, bukan candid yang dibuat-buat.",
    event: "240 Foto Terkumpul",
    rotation: -2.5,
  },
  {
    id: "2",
    name: "Sarah & Pandu",
    role: "Intimate Outdoor Wedding",
    photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80",
    quote: "Jauh lebih hemat dibanding sewa photobooth fisik. Preset Portra 400 nya bikin warna foto estetika film jadul yang hangat!",
    event: "180 Foto Terkumpul",
    rotation: 1.8,
  },
  {
    id: "3",
    name: "Reza — Event Organizer",
    role: "Gala Dinner Perusahaan",
    photo: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=400&q=80",
    quote: "Tamu yang biasanya pemalu jadi aktif jepret sana-sini karena kuota fotonya terasa terbatas kayak roll kamera sungguhan.",
    event: "520 Foto Terkumpul",
    rotation: -1.2,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimoni" className="py-24 bg-cream relative overflow-hidden border-t border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-moss uppercase tracking-widest bg-sand px-3 py-1 rounded-full border border-line">
            ALBUM KESAN & PESAN
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink mt-3 mb-4">
            Cerita manis dari <span className="text-terracotta">pemilik roll</span>
          </h2>
          <p className="font-ui text-base sm:text-lg text-ink/70">
            Setiap cetakan foto menyimpan tawa, haru, dan kejutan dari tamu undangan.
          </p>
        </div>

        {/* Circular Stamp Badges / Cap Stempel Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {/* Stamp 1 */}
          <div className="stamp-border p-6 bg-paper flex flex-col items-center justify-center text-center shadow-stamp hover:rotate-1 transition-transform">
            <div className="w-12 h-12 rounded-full bg-mustard/20 text-mustard-dark flex items-center justify-center mb-2">
              <ImageIcon className="w-6 h-6" />
            </div>
            <span className="font-display text-3xl font-bold text-ink">10,000+</span>
            <span className="font-mono text-xs text-moss uppercase tracking-wider mt-1">
              Foto Berhasil Dicuci
            </span>
          </div>

          {/* Stamp 2 */}
          <div className="stamp-border p-6 bg-paper flex flex-col items-center justify-center text-center shadow-stamp hover:-rotate-1 transition-transform">
            <div className="w-12 h-12 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center mb-2">
              <Star className="w-6 h-6 fill-terracotta" />
            </div>
            <span className="font-display text-3xl font-bold text-ink">4.9 / 5.0</span>
            <span className="font-mono text-xs text-moss uppercase tracking-wider mt-1">
              Rating Kepuasan Host
            </span>
          </div>

          {/* Stamp 3 */}
          <div className="stamp-border p-6 bg-paper flex flex-col items-center justify-center text-center shadow-stamp hover:rotate-1 transition-transform">
            <div className="w-12 h-12 rounded-full bg-moss/20 text-moss flex items-center justify-center mb-2">
              <Award className="w-6 h-6" />
            </div>
            <span className="font-display text-3xl font-bold text-ink">6 Preset</span>
            <span className="font-mono text-xs text-moss uppercase tracking-wider mt-1">
              Filter Film Otentik
            </span>
          </div>
        </div>

        {/* Testimonial Photo Print Cards (Polaroid with Handwritten Caption) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              style={{ transform: `rotate(${item.rotation}deg)` }}
              className="polaroid-frame bg-paper p-4 rounded border border-line shadow-polaroid hover:rotate-0 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo Top Header */}
                <div className="relative aspect-[4/3] w-full rounded overflow-hidden mb-4 bg-sand">
                  <Image
                    src={item.photo}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-ink/70 text-paper font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur">
                    {item.event}
                  </div>
                </div>

                {/* Quote with Handwritten Caveat Font */}
                <blockquote className="font-hand text-2xl text-ink leading-snug mb-4">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              {/* Card Footer Author Details */}
              <div className="pt-3 border-t border-line/60 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm text-ink">{item.name}</h4>
                  <p className="font-mono text-xs text-moss">{item.role}</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-sand flex items-center justify-center text-terracotta font-bold text-xs">
                  ✓
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

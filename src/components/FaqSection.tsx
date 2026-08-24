"use client";

import { useState } from "react";
import { Camera, ChevronDown } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 1,
    question: "Apakah tamu perlu mengunduh aplikasi tambahan?",
    answer: "Tidak sama sekali! Tamu cukup mengarahkan kamera HP ke QR Code yang telah Anda cetak/tampilkan. Web app satukenangan akan terbuka langsung melalui browser HP mereka dalam hitungan detik.",
  },
  {
    id: 2,
    question: "Bagaimana cara kerja efek 'cuci film' (The Reveal)?",
    answer: "Selama acara berlangsung, foto yang diambil tamu disimpan secara privat dalam 'kamera analog digital'. Foto tidak bisa langsung dilihat satu per satu. Setelah waktu hitung mundur acara selesai (misal jam 22.00 malam), galeri otomatis terbuka dan semua foto 'dicuci' bersamaan untuk dinikmati seluruh tamu & host!",
  },
  {
    id: 3,
    question: "Bagaimana jika ada foto tamu yang tidak sopan atau blur?",
    answer: "Sebagai Host/Pemilik Acara, Anda memiliki dashboard admin privat untuk memoderasi, menyembunyikan, atau menghapus foto yang kurang sesuai sebelum galeri utama dibagikan secara umum.",
  },
  {
    id: 4,
    question: "Apakah hasil foto bisa di-download dengan kualitas tinggi (HD)?",
    answer: "Ya! Semua foto disimpan dalam resolusi tinggi asli (Original Quality HD) tanpa kompresi berlebihan. Host dapat mengunduh seluruh album dalam satu file ZIP dengan 1 klik.",
  },
  {
    id: 5,
    question: "Berapa lama foto kami disimpan di server?",
    answer: "Untuk paket gratis disimpan selama 7 hari. Untuk paket berbayar (50+ tamu), foto disimpan aman selama 1 tahun penuh hingga permanen tergantung paket yang Anda pilih.",
  },
  {
    id: 6,
    question: "Metode pembayaran apa saja yang didukung?",
    answer: "Kami mendukung QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay, Dana), Transfer Bank Otomatis, dan Kartu Kredit melalui payment gateway terpercaya Midtrans.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(1); // Open 1st by default

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-paper relative overflow-hidden border-t border-line">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-moss uppercase tracking-widest bg-sand px-3 py-1 rounded-full">
            PERTANYAAN POPULER
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-ink mt-3 mb-4">
            Pertanyaan seputar <span className="text-terracotta">satukenangan</span>
          </h2>
          <p className="font-ui text-base text-ink/70">
            Segala hal yang ingin Anda ketahui sebelum membuat roll acara pertama Anda.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-cream rounded-2xl border border-line overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  type="button"
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display text-lg font-bold text-ink hover:text-terracotta transition-colors"
                >
                  <span>{faq.question}</span>

                  {/* Camera Shutter Blade Aperture Icon Toggle */}
                  <span
                    className={`w-9 h-9 rounded-full bg-sand flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-terracotta text-paper" : "text-ink/70"
                    }`}
                  >
                    <Camera className="w-5 h-5" />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 font-ui text-sm sm:text-base text-ink/80 leading-relaxed border-t border-line/40 mt-1">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

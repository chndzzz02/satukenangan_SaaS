"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Camera, Sparkles } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || searchParams.get("orderId") || "N/A";
  const slug = searchParams.get("slug") || "";

  return (
    <div className="max-w-md w-full bg-cream-card rounded-2xl border-2 border-vintage-gold p-8 shadow-vintage text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500">
        <CheckCircle2 size={36} />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300">
        <Sparkles size={14} /> Pembayaran Berhasil
      </div>

      <h1 className="font-serif text-2xl text-ink font-bold mb-2">
        Terima Kasih! Acara Anda Aktif
      </h1>
      <p className="text-stone-600 text-sm mb-6">
        Pembayaran untuk transaksi <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 font-mono text-xs">{orderId}</code> telah dikonfirmasi.
      </p>

      <div className="space-y-3 mb-6 text-left bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-700">
        <div className="flex justify-between">
          <span className="font-medium text-stone-500">Status Pembayaran:</span>
          <span className="font-bold text-emerald-600">LUNAS</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-stone-500">ID Transaksi:</span>
          <span className="font-mono text-stone-800">{orderId}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {slug ? (
          <Link
            href={`/dashboard/${slug}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-4 rounded-xl transition shadow-md"
          >
            Buka Dashboard Host <ArrowRight size={18} />
          </Link>
        ) : (
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 px-4 rounded-xl transition"
          >
            Kembali ke Beranda
          </Link>
        )}

        {slug && (
          <Link
            href={`/events/${slug}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-2.5 px-4 rounded-xl transition border border-stone-300 text-sm"
          >
            <Camera size={16} /> Lihat Halaman Kamera Tamu
          </Link>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="mb-6">
        <BrandLogo />
      </div>
      <Suspense fallback={<div className="text-stone-500 text-sm">Memuat status pembayaran...</div>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}

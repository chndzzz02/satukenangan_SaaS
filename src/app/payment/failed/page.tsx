"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "N/A";
  const slug = searchParams.get("slug") || "";
  const reason = searchParams.get("reason") || "batal";

  return (
    <div className="max-w-md w-full bg-cream-card rounded-2xl border-2 border-red-300 p-8 shadow-vintage text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-400">
        <AlertCircle size={36} />
      </div>

      <h1 className="font-serif text-2xl text-ink font-bold mb-2">
        Pembayaran Belum Selesai
      </h1>
      <p className="text-stone-600 text-sm mb-6">
        Proses pembayaran untuk pesanan <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 font-mono text-xs">{orderId}</code> {reason === "unfinished" ? "dibatalkan atau belum selesai" : "mengalami kendala"}.
      </p>

      <div className="flex flex-col gap-3">
        {slug ? (
          <Link
            href={`/dashboard/${slug}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 px-4 rounded-xl transition shadow-md"
          >
            <RefreshCw size={18} /> Coba Bayar Ulang di Dashboard
          </Link>
        ) : (
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 px-4 rounded-xl transition"
          >
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>
        )}
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      <div className="mb-6">
        <BrandLogo />
      </div>
      <Suspense fallback={<div className="text-stone-500 text-sm">Memuat status pembayaran...</div>}>
        <PaymentFailedContent />
      </Suspense>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, LoaderCircle, Sparkles, CheckCircle2 } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Registrasi gagal.");
      setMessage(
        data.requiresConfirmation
          ? "Cek email untuk mengonfirmasi akunmu."
          : "Akun berhasil dibuat. Mengarahkan..."
      );
      if (!data.requiresConfirmation) setTimeout(() => router.replace("/login"), 1200);
    } catch (e: any) {
      setError(e.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-terracotta/15 blur-[120px] translate-x-1/3 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-moss/10 blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl"
      >
        <div className="grid min-h-[80vh] overflow-hidden rounded-[2rem] border border-line bg-paper shadow-2xl lg:grid-cols-2">

          {/* Left panel — Form */}
          <motion.section
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center p-6 sm:p-12 lg:order-1"
          >
            <div className="mx-auto w-full max-w-md">
              <Link
                href="/"
                className="mb-10 inline-flex items-center gap-2 font-ui text-sm font-semibold text-ink/55 hover:text-terracotta transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
              </Link>

              <div className="lg:hidden mb-8">
                <BrandLogo />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 border border-terracotta/20 mb-4">
                  <Sparkles className="w-3 h-3 text-terracotta" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[.18em] text-terracotta">Mulai di sini</span>
                </div>
                <h1 className="font-display text-4xl font-semibold text-ink">
                  Buat album yang terasa personal.
                </h1>
                <p className="mt-3 font-ui text-ink/60">
                  Satu akun untuk semua acara dan kenanganmu.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-8"
              >
                <a
                  href="/api/auth/google"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-line bg-white py-3.5 font-ui font-bold text-ink transition hover:bg-cream hover:border-stone-300 shadow-sm"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">G</span>
                  Daftar dengan Google
                </a>

                <div className="my-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-ink/35">
                  <span className="h-px flex-1 bg-line" />
                  atau email
                  <span className="h-px flex-1 bg-line" />
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <label className="block font-ui text-sm font-bold text-ink">
                    Email
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-line bg-cream px-4 py-3.5 outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 font-ui font-normal"
                      placeholder="kamu@email.com"
                    />
                  </label>

                  <label className="block font-ui text-sm font-bold text-ink">
                    Password
                    <input
                      required
                      minLength={6}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-line bg-cream px-4 py-3.5 outline-none transition focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 font-ui font-normal"
                      placeholder="Minimal 6 karakter"
                    />
                  </label>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                      >
                        {error}
                      </motion.p>
                    )}
                    {message && (
                      <motion.div
                        key="message"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-moss flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {message}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-terracotta py-4 font-ui font-bold text-paper transition hover:bg-ink disabled:opacity-60 shadow-lg mt-2"
                  >
                    {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {loading ? "Membuat akun..." : "Buat akun gratis"}
                    {!loading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
                  </motion.button>
                </form>

                <p className="mt-7 text-center font-ui text-sm text-ink/55">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="font-bold text-terracotta hover:underline">
                    Masuk di sini
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Right panel — Ambient Visual */}
          <motion.section
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden overflow-hidden bg-terracotta p-12 text-paper lg:order-2 lg:flex lg:flex-col lg:justify-between"
          >
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-ink/20 blur-3xl" />
            <div className="absolute top-12 right-8 h-48 w-48 rounded-full bg-mustard/20 blur-2xl" />

            {/* Decorative polaroid frames */}
            <div className="absolute bottom-16 right-6 flex flex-col gap-3 opacity-20 rotate-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-12 border-2 border-paper/60 rounded bg-paper/10" />
              ))}
            </div>

            <div className="relative z-10">
              <BrandLogo inverse />
              <h2 className="mt-24 max-w-sm font-display text-5xl font-semibold leading-tight">
                Karena momen kecil layak punya tempat.
              </h2>
              <p className="mt-6 max-w-sm font-ui leading-relaxed text-paper/75">
                Undang tamu, kumpulkan sudut pandang mereka, dan buka semua foto di waktu yang tepat.
              </p>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-paper/80" />
                <span className="font-mono text-xs uppercase tracking-[.2em] text-paper/80">Gratis hingga 5 tamu</span>
              </div>
              <p className="font-mono text-xs text-paper/50">Tanpa kartu kredit. Tanpa komitmen.</p>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}

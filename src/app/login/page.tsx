"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, LoaderCircle, Camera, Lock, Sparkles } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Login gagal.");
      router.replace("/create");
    } catch (e: any) {
      setError(e.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-terracotta/10 blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-mustard/15 blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl"
      >
        <div className="grid min-h-[80vh] overflow-hidden rounded-[2rem] border border-line bg-paper shadow-2xl lg:grid-cols-2">

          {/* Left panel — Ambient Visual */}
          <motion.section
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden overflow-hidden bg-ink p-12 text-paper lg:flex lg:flex-col lg:justify-between"
          >
            {/* Glowing orbs */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-terracotta/40 blur-3xl" />
            <div className="absolute -left-20 bottom-16 h-48 w-48 rounded-full bg-mustard/20 blur-2xl" />

            {/* Film strip decoration */}
            <div className="absolute right-6 top-6 flex flex-col gap-2 opacity-20">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-8 h-5 border border-paper/40 rounded-sm" />
              ))}
            </div>

            <div className="relative z-10">
              <BrandLogo inverse />
              <span className="mt-16 block font-mono text-xs uppercase tracking-[.2em] text-paper/50">
                Satu Kenangan · Host Space
              </span>
              <h2 className="mt-5 max-w-md font-display text-5xl font-semibold leading-tight">
                Buat ruang untuk momen yang ingin kamu ingat.
              </h2>
              <p className="mt-6 max-w-sm font-ui leading-relaxed text-paper/65">
                Kelola album, pilih karakter film, dan biarkan tamu mengisi cerita dari sudut mereka sendiri.
              </p>
            </div>

            <div className="relative z-10 flex gap-8 font-mono text-xs text-paper/55">
              <span>01 / CREATE</span>
              <span>02 / COLLECT</span>
              <span>03 / REVEAL</span>
            </div>
          </motion.section>

          {/* Right panel — Login Form */}
          <motion.section
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center p-6 sm:p-12"
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
                  <Lock className="w-3 h-3 text-terracotta" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[.18em] text-terracotta">Host access</span>
                </div>
                <h1 className="font-display text-4xl font-semibold text-ink">
                  Selamat datang kembali.
                </h1>
                <p className="mt-3 font-ui text-ink/60">
                  Masuk untuk melanjutkan album acaramu.
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
                  Lanjutkan dengan Google
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

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-4 font-ui font-bold text-paper transition hover:bg-terracotta disabled:opacity-60 shadow-lg mt-2"
                  >
                    {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {loading ? "Memproses..." : "Masuk ke dashboard"}
                    {!loading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />}
                  </motion.button>
                </form>

                <p className="mt-7 text-center font-ui text-sm text-ink/55">
                  Belum punya akun?{" "}
                  <Link href="/register" className="font-bold text-terracotta hover:underline">
                    Buat akun gratis
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}

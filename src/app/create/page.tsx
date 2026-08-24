"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShutterButton from "@/components/ShutterButton";
import { Camera, BookOpen, Film, Calendar, Clock, Users, Mail, User, Sparkles, ShieldCheck } from "lucide-react";
import { PresetId, ExperienceType, RevealTimeType } from "@/types";

const PRESETS = [
  { id: "portra400", name: "Kodak Portra 400", tag: "Warm Skin & Pastel", bg: "bg-amber-100 text-amber-900" },
  { id: "cinestill800t", name: "CineStill 800T", tag: "Night Glow Neon", bg: "bg-indigo-100 text-indigo-900" },
  { id: "funsaver", name: "Kodak FunSaver", tag: "Vintage Disposable Yellow", bg: "bg-yellow-100 text-yellow-900" },
  { id: "quicksnap", name: "Fujifilm QuickSnap", tag: "Cool Green Tone", bg: "bg-emerald-100 text-emerald-900" },
  { id: "hp5plus", name: "Ilford HP5 Plus", tag: "Classic Monochromatic B&W", bg: "bg-gray-200 text-gray-900" },
  { id: "ektar100", name: "Kodak Ektar 100", tag: "Rich Punchy Colors", bg: "bg-rose-100 text-rose-900" },
];

export default function CreateEventPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [experienceType, setExperienceType] = useState<ExperienceType>("camera");
  const [eventName, setEventName] = useState("");
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [presetId, setPresetId] = useState<PresetId>("portra400");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]);
  const [revealTimeType, setRevealTimeType] = useState<RevealTimeType>("during");
  const [guestLimit, setGuestLimit] = useState(50);
  const [loading, setLoading] = useState(false);

  const calculatePrice = (limit: number) => {
    if (limit <= 5) return 0;
    if (limit <= 50) return 149000;
    if (limit <= 100) return 279000;
    if (limit <= 200) return 449000;
    return 799000;
  };

  const handleCreate = async () => {
    if (!eventName || !hostName || !hostEmail) {
      alert("Mohon lengkapi Nama Acara, Nama Host, dan Email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: eventName,
          hostName,
          hostEmail,
          experienceType,
          presetId,
          eventDate,
          revealTimeType,
          revealDateTime: revealTimeType === "immediately" ? new Date().toISOString() : revealTimeType === "custom" ? new Date(Date.now() + 3600000 * 4).toISOString() : new Date(`${eventDate}T23:59:59`).toISOString(),
          guestLimit,
          photoLimitPerGuest: 24,
        }),
      });

      const data = await res.json();
      if (data.success && data.event) {
        const slug = data.event.slug;

        // If paid, trigger payment route
        if (data.event.price > 0) {
          const payRes = await fetch("/api/payments/snap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
          });
          const payData = await payRes.json();
          if (payData.success) {
            router.push(`/dashboard/${slug}?created=true`);
          }
        } else {
          router.push(`/dashboard/${slug}?created=true`);
        }
      }
    } catch (err: any) {
      alert(err.message || "Gagal membuat acara.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream text-ink">
      <Navbar />

      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="font-mono text-xs text-moss uppercase tracking-widest bg-sand px-3 py-1 rounded-full">
            HOST FLOW WIZARD
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mt-3">
            Buat Roll Acara <span className="text-terracotta">Baru</span>
          </h1>
          <p className="font-ui text-base text-ink/70 mt-2">
            Hanya butuh 2 menit untuk menyiapkan kamera sekali pakai digital untuk acaramu.
          </p>
        </div>

        {/* Wizard Form Container */}
        <div className="bg-paper p-8 rounded-3xl border border-line shadow-xl">
          {/* Step 1: Experience Choice */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-ink flex items-center gap-2">
                <span>1. Pilih Jenis Pengalaman Acara</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setExperienceType("camera")}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    experienceType === "camera"
                      ? "border-terracotta bg-cream shadow-md scale-[1.02]"
                      : "border-line bg-paper hover:bg-cream/40"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-terracotta text-paper flex items-center justify-center mb-4">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-ink">Kamera Sekali Pakai</h4>
                  <p className="font-ui text-xs text-ink/70 mt-1 leading-relaxed">
                    Tamu mengambil foto dari HP dengan viewfinder analog. Foto disembunyikan sampai waktu cuci film selesai.
                  </p>
                </div>

                <div
                  onClick={() => setExperienceType("guestbook")}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    experienceType === "guestbook"
                      ? "border-terracotta bg-cream shadow-md scale-[1.02]"
                      : "border-line bg-paper hover:bg-cream/40"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-moss text-paper flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-ink">Digital Guestbook</h4>
                  <p className="font-ui text-xs text-ink/70 mt-1 leading-relaxed">
                    Tamu mengupload foto beserta ucapan pesan hangat yang tersimpan langsung di buku tamu digital.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-terracotta text-paper font-bold rounded-full hover:bg-terracotta-hover transition-colors"
                >
                  Lanjut ke Detail Acara
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Event Info & Preset */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-ink">
                2. Detail Acara & Pilih Preset Film
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-ink mb-1">Nama Acara *</label>
                  <input
                    type="text"
                    placeholder="misal: Pernikahan Emma & Noah"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full px-4 py-3 bg-cream rounded-xl border border-line text-ink font-ui focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-ink mb-1">Tanggal Acara</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 bg-cream rounded-xl border border-line text-ink font-ui focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-ink mb-1">Nama Host / Penyelenggara *</label>
                  <input
                    type="text"
                    placeholder="misal: Emma & Noah"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full px-4 py-3 bg-cream rounded-xl border border-line text-ink font-ui focus:outline-none focus:border-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-ink mb-1">Email Host *</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={hostEmail}
                    onChange={(e) => setHostEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-cream rounded-xl border border-line text-ink font-ui focus:outline-none focus:border-terracotta"
                  />
                </div>
              </div>

              {/* Preset Selection */}
              <div>
                <label className="block font-mono text-xs font-bold text-ink mb-2">Pilih Preset Roll Film</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRESETS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPresetId(p.id as PresetId)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        presetId === p.id
                          ? "bg-cream border-terracotta ring-2 ring-terracotta/20 shadow-sm"
                          : "bg-paper border-line hover:bg-cream/30"
                      }`}
                    >
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${p.bg}`}>
                        {p.tag}
                      </span>
                      <h5 className="font-mono text-sm font-bold text-ink mt-2">{p.name}</h5>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-sand text-ink font-bold rounded-full hover:bg-sand/80"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-terracotta text-paper font-bold rounded-full hover:bg-terracotta-hover"
                >
                  Lanjut ke Kapasitas Tamu
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Quota & Review */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-ink">
                3. Kuota Tamu & Pengaktifan Roll
              </h3>

              <div>
                <label className="block font-mono text-xs font-bold text-ink mb-2">Pilih Jumlah Tamu Undangan</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[5, 50, 100, 200, 9999].map((limit) => (
                    <button
                      key={limit}
                      type="button"
                      onClick={() => setGuestLimit(limit)}
                      className={`py-3 px-2 rounded-xl font-mono text-sm font-bold border transition-all ${
                        guestLimit === limit
                          ? "bg-terracotta text-paper border-terracotta shadow-md"
                          : "bg-cream text-ink border-line hover:border-terracotta"
                      }`}
                    >
                      {limit === 9999 ? "Unlimited" : `${limit} Tamu`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Summary Box */}
              <div className="p-6 bg-cream rounded-2xl border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-moss uppercase">Total Investasi Roll:</span>
                  <div className="font-display text-3xl font-bold text-ink mt-1">
                    {calculatePrice(guestLimit) === 0 ? (
                      <span className="text-mustard-dark">GRATIS (5 Tamu)</span>
                    ) : (
                      `Rp ${calculatePrice(guestLimit).toLocaleString("id-ID")}`
                    )}
                  </div>
                  <p className="font-ui text-xs text-ink/70 mt-1">
                    Pembayaran sekali bayar via Midtrans (QRIS, GoPay, Bank Transfer).
                  </p>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-4 bg-terracotta hover:bg-terracotta-hover text-paper font-bold text-base rounded-full shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? "Memproses Roll..." : "Aktifkan Acara"}
                </button>
              </div>

              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-sand text-ink font-bold rounded-full hover:bg-sand/80"
                >
                  Kembali
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

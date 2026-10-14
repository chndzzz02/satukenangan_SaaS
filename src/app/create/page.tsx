"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera, BookOpen, Film, Calendar, Users, Mail, User, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import { PresetId, ExperienceType, RevealTimeType } from "@/types";

const PRESETS = [
  { id: "portra400", name: "Kodak Portra 400", tag: "Warm Skin & Pastel", bg: "bg-amber-100 text-amber-900", dot: "bg-amber-400" },
  { id: "cinestill800t", name: "CineStill 800T", tag: "Night Glow Neon", bg: "bg-indigo-100 text-indigo-900", dot: "bg-indigo-500" },
  { id: "funsaver", name: "Kodak FunSaver", tag: "Vintage Disposable Yellow", bg: "bg-yellow-100 text-yellow-900", dot: "bg-yellow-400" },
  { id: "quicksnap", name: "Fujifilm QuickSnap", tag: "Cool Green Tone", bg: "bg-emerald-100 text-emerald-900", dot: "bg-emerald-500" },
  { id: "hp5plus", name: "Ilford HP5 Plus", tag: "Classic Monochromatic B&W", bg: "bg-gray-200 text-gray-900", dot: "bg-gray-600" },
  { id: "ektar100", name: "Kodak Ektar 100", tag: "Rich Punchy Colors", bg: "bg-rose-100 text-rose-900", dot: "bg-rose-500" },
];

const STEPS = [
  { number: 1, label: "Jenis Acara" },
  { number: 2, label: "Detail & Film" },
  { number: 3, label: "Kuota Tamu" },
];

const GUEST_TIERS = [
  { limit: 5, label: "5 Tamu", sublabel: "Gratis", price: 0, badge: "FREE" },
  { limit: 50, label: "50 Tamu", sublabel: "Pesta kecil", price: 149000, badge: null },
  { limit: 100, label: "100 Tamu", sublabel: "Acara menengah", price: 279000, badge: null },
  { limit: 200, label: "200 Tamu", sublabel: "Pesta besar", price: 449000, badge: null },
  { limit: 9999, label: "Unlimited", sublabel: "Tidak terbatas", price: 799000, badge: "BEST VALUE" },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 60 : -60, opacity: 0 }),
};

export default function CreateEventPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [experienceType, setExperienceType] = useState<ExperienceType>("camera");
  const [eventName, setEventName] = useState("");
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [presetId, setPresetId] = useState<PresetId>("portra400");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]);
  const [revealTimeType, setRevealTimeType] = useState<RevealTimeType>("during");
  const [guestLimit, setGuestLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const goTo = (nextStep: number) => {
    if (nextStep === 3 && (!eventName.trim() || !hostName.trim() || !hostEmail.trim())) {
      setFormError("Lengkapi nama acara, nama host, dan email host terlebih dahulu.");
      return;
    }
    setFormError("");

    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  const calculatePrice = (limit: number) => {
    if (limit <= 5) return 0;
    if (limit <= 50) return 149000;
    if (limit <= 100) return 279000;
    if (limit <= 200) return 449000;
    return 799000;
  };

  const handleCreate = async () => {
    if (!eventName || !hostName || !hostEmail) {
      setFormError("Mohon lengkapi Nama Acara, Nama Host, dan Email.");
      return;
    }
    setFormError("");
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
          revealDateTime:
            revealTimeType === "immediately"
              ? new Date().toISOString()
              : revealTimeType === "custom"
              ? new Date(Date.now() + 3600000 * 4).toISOString()
              : new Date(`${eventDate}T23:59:59`).toISOString(),
          guestLimit,
          photoLimitPerGuest: 24,
        }),
      });

      const data = await res.json();
      if (data.success && data.event) {
        const slug = data.event.slug;
        if (data.event.price > 0) {
          await fetch("/api/payments/snap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
          });
        }
        router.push(`/dashboard/${slug}?created=true`);
      } else {
        setFormError(data.error || "Gagal membuat acara.");
      }
    } catch (err: any) {
      setFormError(err.message || "Gagal membuat acara.");
    } finally {
      setLoading(false);
    }
  };

  const selectedTier = GUEST_TIERS.find((t) => t.limit === guestLimit) || GUEST_TIERS[1];

  return (
    <main className="min-h-screen bg-cream text-ink">
      <Navbar />

      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-terracotta/10 border border-terracotta/20 font-mono text-xs font-bold uppercase tracking-widest text-terracotta mb-4">
            <Film className="w-3.5 h-3.5" /> HOST FLOW WIZARD
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mt-2">
            Buat Roll Acara <span className="text-terracotta">Baru</span>
          </h1>
          <p className="font-ui text-base text-ink/70 mt-3 max-w-lg mx-auto">
            Hanya butuh 2 menit untuk menyiapkan kamera sekali pakai digital untuk acaramu.
          </p>
        </motion.div>

        {/* Step Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex items-center justify-center gap-0 mb-10"
        >
          {STEPS.map((s, idx) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 ${
                    step > s.number
                      ? "bg-terracotta text-paper"
                      : step === s.number
                      ? "bg-ink text-paper ring-4 ring-ink/20"
                      : "bg-sand text-ink/50"
                  }`}
                >
                  {step > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                </div>
                <span className={`font-mono text-[10px] mt-1.5 font-bold transition-colors ${step === s.number ? "text-ink" : "text-ink/40"}`}>
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-20 h-px mx-2 mb-5 transition-all duration-500 ${step > s.number ? "bg-terracotta" : "bg-line"}`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Wizard Form Card */}
        <div className="bg-paper rounded-3xl border border-line shadow-xl overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            {/* â”€â”€ STEP 1: Experience Type â”€â”€ */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 space-y-6"
              >
                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">Pilih Jenis Pengalaman Acara</h3>
                  <p className="font-ui text-sm text-ink/60 mt-1">Apa yang ingin kamu sajikan untuk tamu undangan?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      type: "camera" as ExperienceType,
                      icon: <Camera className="w-6 h-6" />,
                      color: "bg-terracotta",
                      title: "Kamera Sekali Pakai",
                      desc: "Tamu mengambil foto dari HP dengan viewfinder analog. Foto disembunyikan sampai waktu cuci film selesai.",
                      tag: "POPULER",
                    },
                    {
                      type: "guestbook" as ExperienceType,
                      icon: <BookOpen className="w-6 h-6" />,
                      color: "bg-moss",
                      title: "Digital Guestbook",
                      desc: "Tamu mengupload foto beserta ucapan pesan hangat yang tersimpan langsung di buku tamu digital.",
                      tag: null,
                    },
                  ].map((opt) => (
                    <motion.div
                      key={opt.type}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setExperienceType(opt.type)}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative ${
                        experienceType === opt.type
                          ? "border-terracotta bg-terracotta/5 shadow-lg"
                          : "border-line bg-paper hover:bg-cream/60"
                      }`}
                    >
                      {opt.tag && (
                        <span className="absolute top-3 right-3 font-mono text-[9px] bg-terracotta text-paper px-2 py-0.5 rounded-full font-bold">
                          {opt.tag}
                        </span>
                      )}
                      {experienceType === opt.type && (
                        <motion.div
                          layoutId="check"
                          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-terracotta flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-4 h-4 text-paper" />
                        </motion.div>
                      )}
                      <div className={`w-12 h-12 rounded-xl ${opt.color} text-paper flex items-center justify-center mb-4`}>
                        {opt.icon}
                      </div>
                      <h4 className="font-display font-bold text-lg text-ink">{opt.title}</h4>
                      <p className="font-ui text-xs text-ink/70 mt-1 leading-relaxed">{opt.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => goTo(2)}
                    className="px-7 py-3 bg-ink text-paper font-bold rounded-full hover:bg-terracotta transition-colors flex items-center gap-2 shadow-md"
                  >
                    Lanjut ke Detail Acara <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* â”€â”€ STEP 2: Event Info & Preset â”€â”€ */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 space-y-6"
              >
                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">Detail Acara & Pilih Preset Film</h3>
                  <p className="font-ui text-sm text-ink/60 mt-1">Isi informasi acara dan pilih karakter film analog-mu.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Nama Acara *", value: eventName, onChange: setEventName, placeholder: "misal: Pernikahan Emma & Noah", type: "text", icon: <Sparkles className="w-4 h-4" /> },
                    { label: "Tanggal Acara", value: eventDate, onChange: setEventDate, placeholder: "", type: "date", icon: <Calendar className="w-4 h-4" /> },
                    { label: "Nama Host / Penyelenggara *", value: hostName, onChange: setHostName, placeholder: "misal: Emma & Noah", type: "text", icon: <User className="w-4 h-4" /> },
                    { label: "Email Host *", value: hostEmail, onChange: setHostEmail, placeholder: "email@domain.com", type: "email", icon: <Mail className="w-4 h-4" /> },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink mb-2">
                        <span className="text-terracotta">{field.icon}</span>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full px-4 py-3 bg-cream rounded-xl border border-line text-ink font-ui focus:outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 transition"
                      />
                    </div>
                  ))}
                </div>

                {/* Preset Film Grid */}
                <div>
                  <label className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink mb-3">
                    <Film className="w-4 h-4 text-terracotta" /> Pilih Preset Roll Film
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESETS.map((p) => (
                      <motion.div
                        key={p.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPresetId(p.id as PresetId)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all relative ${
                          presetId === p.id
                            ? "border-terracotta bg-terracotta/5 shadow-md"
                            : "border-line bg-paper hover:bg-cream/40"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${p.dot}`} />
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${p.bg}`}>{p.tag}</span>
                        </div>
                        <h5 className="font-mono text-sm font-bold text-ink">{p.name}</h5>
                        {presetId === p.id && (
                          <motion.div
                            layoutId="preset-check"
                            className="absolute top-2 right-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-terracotta" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => goTo(1)} className="px-5 py-2.5 bg-sand text-ink font-bold rounded-full hover:bg-sand/80 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => goTo(3)} className="px-7 py-3 bg-ink text-paper font-bold rounded-full hover:bg-terracotta transition-colors flex items-center gap-2 shadow-md">
                    Lanjut ke Kuota Tamu <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* â”€â”€ STEP 3: Quota & Confirm â”€â”€ */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 space-y-6"
              >
                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">Kuota Tamu & Pengaktifan Roll</h3>
                  <p className="font-ui text-sm text-ink/60 mt-1">Pilih kapasitas tamu yang sesuai dengan skala acaramu.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {GUEST_TIERS.map((tier) => (
                    <motion.button
                      key={tier.limit}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={() => setGuestLimit(tier.limit)}
                      className={`py-4 px-2 rounded-2xl font-mono text-sm font-bold border-2 transition-all relative flex flex-col items-center gap-1 ${
                        guestLimit === tier.limit
                          ? "bg-terracotta text-paper border-terracotta shadow-lg scale-[1.03]"
                          : "bg-cream text-ink border-line hover:border-terracotta/50"
                      }`}
                    >
                      {tier.badge && (
                        <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          guestLimit === tier.limit ? "bg-paper text-terracotta" : "bg-terracotta text-paper"
                        }`}>
                          {tier.badge}
                        </span>
                      )}
                      <Users className="w-4 h-4" />
                      <span>{tier.label}</span>
                      <span className={`text-[10px] font-normal ${guestLimit === tier.limit ? "text-paper/80" : "text-ink/50"}`}>
                        {tier.sublabel}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Price summary */}
                <motion.div
                  layout
                  className="p-6 bg-cream rounded-2xl border-2 border-line"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-xs text-moss uppercase tracking-widest block mb-1">Total Investasi Roll</span>
                      <motion.div
                        key={guestLimit}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="font-display text-4xl font-bold text-ink"
                      >
                        {calculatePrice(guestLimit) === 0 ? (
                          <span className="text-emerald-700">GRATIS</span>
                        ) : (
                          `Rp ${calculatePrice(guestLimit).toLocaleString("id-ID")}`
                        )}
                      </motion.div>
                      <p className="font-ui text-xs text-ink/60 mt-1">
                        Bayar sekali via Midtrans (QRIS, GoPay, Bank Transfer, Kartu).
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:text-right text-xs font-mono text-ink/60">
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kapasitas: <strong className="text-ink">{guestLimit === 9999 ? "Tidak terbatas" : `${guestLimit} tamu`}</strong></span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kuota foto per tamu: <strong className="text-ink">24 FRAME</strong></span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Preset: <strong className="text-ink">{presetId.toUpperCase()}</strong></span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formError && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2"
                      >
                        {formError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={loading}
                    className="mt-5 w-full py-4 bg-terracotta hover:bg-ink text-paper font-bold text-base rounded-2xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-paper border-t-transparent rounded-full" />
                        Memproses Roll...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Aktifkan Acara Sekarang
                      </>
                    )}
                  </motion.button>
                </motion.div>

                <div className="pt-2 flex justify-start">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="button" onClick={() => goTo(2)} className="px-5 py-2.5 bg-sand text-ink font-bold rounded-full hover:bg-sand/80 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  );
}





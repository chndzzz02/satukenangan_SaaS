"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastNotification, { ToastMessage, ToastType } from "@/components/ToastNotification";
import JSZip from "jszip";
import {
  Camera,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  Copy,
  Trash2,
  CreditCard,
  UserPlus,
  Sparkles,
  AlertTriangle,
  X,
  PauseCircle,
  PlayCircle,
  CheckCircle,
  FileSpreadsheet,
  Archive,
  Search,
  Users,
  Trophy,
} from "lucide-react";
import type { SatukenanganEvent, Photo } from "@/types";

declare global {
  interface Window {
    snap?: any;
  }
}

export default function HostDashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isJustCreated = searchParams.get("created") === "true";

  const [event, setEvent] = useState<SatukenanganEvent | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [guestFilter, setGuestFilter] = useState("all");

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (message: string, type: ToastType = "success") => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`/api/events/${slug}?dashboard=true`);
      const data = await res.json();
      if (data.success) {
        setEvent(data.event);
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Load Midtrans Snap JS Script dynamically
    const snapScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
    if (clientKey && !document.getElementById("midtrans-snap-script")) {
      const script = document.createElement("script");
      script.src = snapScriptUrl;
      script.id = "midtrans-snap-script";
      script.setAttribute("data-client-key", clientKey);
      document.body.appendChild(script);
    }
  }, [slug]);

  const handlePayOrTopUp = async (topUpLimit?: number, priceAmount?: number) => {
    setPaying(true);
    try {
      const res = await fetch("/api/payments/snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          topUpGuestLimit: topUpLimit,
          priceAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        addToast(data.error || "Gagal memproses pembayaran Midtrans.", "error");
        setPaying(false);
        return;
      }

      if (data.isMock || !data.snapToken) {
        window.location.href = data.redirectUrl;
        return;
      }

      if (window.snap) {
        window.snap.pay(data.snapToken, {
          onSuccess: function () {
            window.location.href = `/payment/success?order_id=${data.orderId}&slug=${slug}`;
          },
          onPending: function () {
            addToast("Pembayaran Anda dalam status PENDING. Silakan selesaikan pembayaran.", "info");
            fetchDashboardData();
          },
          onError: function () {
            window.location.href = `/payment/failed?order_id=${data.orderId}&slug=${slug}&reason=error`;
          },
          onClose: function () {
            setPaying(false);
          },
        });
      } else if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err: any) {
      addToast("Terjadi kesalahan: " + err.message, "error");
    } finally {
      setPaying(false);
    }
  };

  const updateEventStatus = async (status: "active" | "paused" | "completed") => {
    try {
      const res = await fetch(`/api/events/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setEvent((prev) => prev ? { ...prev, status } : prev);
        addToast(`Status acara diubah menjadi ${status.toUpperCase()}`, "success");
      } else {
        addToast(data.error || "Gagal mengubah status acara.", "error");
      }
    } catch (err: any) {
      addToast(err.message || "Gagal mengubah status acara.", "error");
    }
  };

  const moderatePhoto = async (photoId: string, action: "hide" | "delete") => {
    if (action === "delete" && !window.confirm("Hapus foto ini dari album?")) return;
    const response = await fetch(`/api/host/photos/${photoId}?slug=${encodeURIComponent(slug)}`, { method: action === "hide" ? "PATCH" : "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.success) { addToast(data.error || "Aksi moderasi gagal.", "error"); return; }
    addToast(action === "hide" ? "Visibilitas foto diperbarui." : "Foto berhasil dihapus.", "success");
    await fetchDashboardData();
  };

  const revealGallery = async () => {
    if (!window.confirm("Buka semua foto untuk seluruh tamu sekarang?")) return;
    const response = await fetch(`/api/host/events/${slug}/reveal`, { method: "POST" });
    const data = await response.json();
    if (!response.ok || !data.success) { addToast(data.error || "Gagal membuka galeri.", "error"); return; }
    setEvent((current) => current ? { ...current, revealedAt: new Date().toISOString() } : current);
    addToast("Galeri foto berhasil dibuka untuk publik!", "success");
    await fetchDashboardData();
  };

  const copyGuestLink = () => {
    const url = `${window.location.origin}/events/${slug}`;
    navigator.clipboard.writeText(url);
    addToast("Link acara berhasil disalin ke clipboard!", "success");
  };

  // Bulk Download All Photos as ZIP
  const downloadAllPhotosZIP = async () => {
    if (photos.length === 0) {
      addToast("Belum ada foto untuk diunduh.", "info");
      return;
    }

    setZipping(true);
    addToast("Mempersiapkan pengunduhan album (.ZIP)...", "info");

    try {
      const zip = new JSZip();
      const folder = zip.folder(`${slug}-album`);

      const photoPromises = photos.map(async (photo, index) => {
        try {
          const response = await fetch(photo.photoUrl);
          const blob = await response.blob();
          const ext = photo.photoUrl.includes("png") ? "png" : "jpg";
          const fileName = `FRAME_${photo.frameNumber}_${photo.guestName.replace(/[^a-zA-Z0-9]+/g, "_")}_${index + 1}.${ext}`;
          folder?.file(fileName, blob);
        } catch (err) {
          console.error("Gagal mengunduh foto:", photo.id, err);
        }
      });

      await Promise.all(photoPromises);

      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = `${slug}-satukenangan-album.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      addToast("Album foto berhasil diunduh sebagai file ZIP!", "success");
    } catch (err: any) {
      addToast("Gagal mengompres album: " + err.message, "error");
    } finally {
      setZipping(false);
    }
  };

  // Export Event Summary to CSV
  const exportToCSV = () => {
    if (!event) return;

    const guestStatsMap: Record<string, number> = {};
    photos.forEach((p) => {
      guestStatsMap[p.guestName] = (guestStatsMap[p.guestName] || 0) + 1;
    });

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nama Acara,Penyelenggara,Preset,Kapasitas Tamu,Total Foto,Status Pembayaran\n";
    csvContent += `"${event.name}","${event.hostName}","${event.presetId}",${event.guestLimit},${photos.length},"${event.paymentStatus}"\n\n`;

    csvContent += "Nama Tamu,Jumlah Foto Jepretan\n";
    Object.entries(guestStatsMap).forEach(([name, count]) => {
      csvContent += `"${name}",${count}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${slug}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("Data laporan acara berhasil diekspor ke CSV!", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-mono text-terracotta">
        Memuat Dashboard Host...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6">
        <h2 className="font-display text-2xl font-bold text-ink">Dashboard Tidak Ditemukan</h2>
      </div>
    );
  }

  const isUnpaid = event.paymentStatus === "unpaid";
  const isPaid = event.paymentStatus === "paid" || event.paymentStatus === "free";

  // Guest leaderboard stats
  const guestLeaderboardMap: Record<string, number> = {};
  photos.forEach((p) => {
    guestLeaderboardMap[p.guestName] = (guestLeaderboardMap[p.guestName] || 0) + 1;
  });

  const sortedLeaderboard = Object.entries(guestLeaderboardMap)
    .sort((a, b) => b[1] - a[1]);

  const filteredPhotos = photos.filter((p) => {
    const matchesGuest = guestFilter === "all" || p.guestName === guestFilter;
    const matchesQuery = !searchQuery.trim() ||
      p.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGuest && matchesQuery;
  });

  return (
    <main className="min-h-screen bg-cream text-ink">
      <Navbar />
      <ToastNotification toasts={toasts} onClose={removeToast} />

      <div className="pt-32 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Welcome Message */}
        {isJustCreated && (
          <div className="mb-8 p-4 bg-mustard/20 border border-mustard rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-terracotta shrink-0" />
              <div>
                <h4 className="font-display font-bold text-ink text-sm">Acara berhasil dibuat!</h4>
                <p className="font-ui text-xs text-ink/80">
                  Cetak QR Code di bawah atau bagikan link ke seluruh tamu undangan Anda.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Unpaid Warning Banner */}
        {isUnpaid && (
          <div className="mb-8 p-5 bg-amber-50 border-2 border-amber-400 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-bold text-amber-900 text-sm">Pembayaran Paket Belum Selesai</h4>
                <p className="font-ui text-xs text-amber-800 mt-0.5">
                  Selesaikan pembayaran Rp {event.price.toLocaleString("id-ID")} untuk mengaktifkan album foto tamu secara penuh.
                </p>
              </div>
            </div>
            <button
              onClick={() => handlePayOrTopUp()}
              disabled={paying}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span>{paying ? "Memproses..." : "Bayar Sekarang (Midtrans)"}</span>
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-line pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] bg-terracotta text-paper px-2.5 py-0.5 rounded-full font-bold uppercase">
                HOST DASHBOARD
              </span>
              <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                isPaid ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}>
                BAYAR: {event.paymentStatus.toUpperCase()}
              </span>
              <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                event.status === "active" ? "bg-emerald-800 text-paper" : event.status === "paused" ? "bg-amber-500 text-paper" : "bg-stone-800 text-paper"
              }`}>
                STATUS: {event.status.toUpperCase()}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">{event.name}</h1>
            <p className="font-ui text-xs text-moss mt-1">
              Penyelenggara: <strong>{event.hostName}</strong> ({event.hostEmail}) | Preset: <strong>{event.presetId.toUpperCase()}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Event Status Controls */}
            {event.status === "active" ? (
              <button
                onClick={() => updateEventStatus("paused")}
                className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                title="Jeda sementara pengunggahan foto oleh tamu"
              >
                <PauseCircle size={15} /> Pause Event
              </button>
            ) : event.status === "paused" ? (
              <button
                onClick={() => updateEventStatus("active")}
                className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                title="Lanjutkan pengunggahan foto"
              >
                <PlayCircle size={15} /> Resume Event
              </button>
            ) : null}

            {event.status !== "completed" && (
              <button
                onClick={() => {
                  if (window.confirm("Tutup acara ini secara permanen? Tamu tidak akan dapat mengunggah foto lagi.")) {
                    updateEventStatus("completed");
                  }
                }}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <CheckCircle size={15} /> Tutup Event
              </button>
            )}

            {!event.revealedAt && (
              <button onClick={revealGallery} className="px-4 py-2 bg-mustard hover:bg-mustard-dark text-ink font-bold text-xs rounded-xl shadow-sm">
                Buka galeri sekarang
              </button>
            )}

            <button
              onClick={copyGuestLink}
              className="px-3.5 py-2 bg-paper hover:bg-cream border border-line text-ink font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Copy className="w-4 h-4 text-terracotta" />
              <span>Salin Link</span>
            </button>

            <a
              href={`/events/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-terracotta hover:bg-terracotta-hover text-paper font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Kamera Tamu</span>
            </a>
          </div>
        </div>

        {/* Dashboard Stat & Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* QR Code Printable Card (5 cols) */}
          <div className="md:col-span-5 bg-paper p-6 rounded-3xl border border-line shadow-xl text-center flex flex-col items-center">
            <h3 className="font-display text-lg font-bold text-ink mb-1">QR Code Siap Cetak</h3>
            <p className="font-ui text-xs text-ink/70 mb-4">
              Cetak QR Code ini dan letakkan di meja resepsi / tempat acara.
            </p>

            <div className="polaroid-frame bg-cream p-4 rounded-2xl border border-line shadow-md mb-4">
              <img src={event.qrCodeUrl} alt="QR Code Acara" className="w-48 h-48 object-contain rounded" />
              <span className="font-mono text-[10px] text-ink/60 block mt-2">SCAN DENGAN KAMERA HP</span>
            </div>

            <div className="w-full space-y-2">
              <a
                href={event.qrCodeUrl}
                download={`qrcode-${slug}.png`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-sand hover:bg-sand/80 text-ink font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-terracotta" />
                <span>Download QR Code (PNG)</span>
              </a>

              <button
                onClick={downloadAllPhotosZIP}
                disabled={zipping || photos.length === 0}
                className="w-full py-2.5 bg-terracotta hover:bg-terracotta-hover text-paper font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-sm"
              >
                <Archive className="w-4 h-4" />
                <span>{zipping ? "Mengompres Album..." : "Download Seluruh Album (.ZIP)"}</span>
              </button>

              <button
                onClick={exportToCSV}
                className="w-full py-2 bg-paper hover:bg-cream text-moss border border-line font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Laporan Data (CSV)</span>
              </button>
            </div>
          </div>

          {/* Statistics & Leaderboard (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-paper rounded-2xl border border-line shadow-sm">
                <span className="font-mono text-xs text-moss uppercase">Total Foto Terkumpul</span>
                <div className="font-display text-3xl font-bold text-ink mt-1">{photos.length} Foto</div>
                <span className="font-mono text-[10px] text-terracotta mt-1 block">Foto siap dicuci</span>
              </div>

              <div className="p-5 bg-paper rounded-2xl border border-line shadow-sm flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-moss uppercase">Kapasitas Tamu</span>
                  <div className="font-display text-3xl font-bold text-ink mt-1">{event.guestLimit} Tamu</div>
                </div>
                <button
                  onClick={() => setIsTopUpOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg border border-amber-300 transition w-fit"
                >
                  <UserPlus size={14} /> Top-Up Kuota Tamu
                </button>
              </div>
            </div>

            {/* Active Guest Leaderboard */}
            <div className="p-5 bg-paper rounded-2xl border border-line shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-line pb-2">
                <h4 className="font-display font-bold text-ink text-sm flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" /> Tamu Paling Aktif ({sortedLeaderboard.length})
                </h4>
                <span className="font-mono text-[10px] text-moss">Kontribusi Jepretan</span>
              </div>

              {sortedLeaderboard.length === 0 ? (
                <p className="text-xs text-stone-500 font-ui italic">Belum ada tamu yang mengambil foto.</p>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {sortedLeaderboard.slice(0, 5).map(([guestName, count], idx) => (
                    <div key={guestName} className="flex items-center justify-between p-2 rounded-xl bg-cream/50 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-terracotta w-5">#{idx + 1}</span>
                        <span className="font-semibold text-stone-800">{guestName}</span>
                      </div>
                      <span className="font-mono bg-sand px-2 py-0.5 rounded text-stone-800 font-bold">
                        {count} foto
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top-up Quota Modal */}
        {isTopUpOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cream-card max-w-lg w-full rounded-2xl border-2 border-vintage-gold p-6 shadow-vintage relative">
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 p-1"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
                <Sparkles size={18} /> Upgrade Paket Acara
              </div>
              <h3 className="font-display text-2xl font-bold text-ink mb-2">Top-Up Kuota Tamu</h3>
              <p className="text-xs text-stone-600 mb-6">
                Tambah kapasitas tamu untuk acara <strong>{event.name}</strong> (Kapasitas saat ini: {event.guestLimit} tamu).
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { limit: 50, price: 149000, label: "Paket Medium (50 Tamu)" },
                  { limit: 100, price: 279000, label: "Paket Large (100 Tamu)" },
                  { limit: 200, price: 449000, label: "Paket Extra Large (200 Tamu)" },
                  { limit: 9999, price: 799000, label: "Paket Unlimited (Tamu Tanpa Batas)" },
                ]
                  .filter((p) => p.limit > event.guestLimit)
                  .map((tier) => (
                    <div
                      key={tier.limit}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-500 transition"
                    >
                      <div>
                        <h5 className="font-bold text-sm text-stone-800">{tier.label}</h5>
                        <span className="text-xs text-stone-500">Rp {tier.price.toLocaleString("id-ID")}</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsTopUpOpen(false);
                          handlePayOrTopUp(tier.limit, tier.price);
                        }}
                        disabled={paying}
                        className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-lg transition"
                      >
                        Pilih & Bayar
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setIsTopUpOpen(false)}
                className="w-full py-2.5 text-stone-600 font-medium text-xs rounded-xl bg-stone-100 hover:bg-stone-200 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Photos Moderation Gallery & Filtering */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-3">
            <h3 className="font-display text-xl font-bold text-ink">
              Moderasi Foto Terkumpul ({filteredPhotos.length})
            </h3>

            {/* Live Search & Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari nama tamu / caption..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-paper rounded-xl border border-line text-xs font-ui text-ink focus:outline-none focus:border-terracotta w-48 sm:w-60 shadow-sm"
                />
              </div>

              <select
                value={guestFilter}
                onChange={(e) => setGuestFilter(e.target.value)}
                className="px-3 py-1.5 bg-paper rounded-xl border border-line text-xs font-mono text-ink focus:outline-none shadow-sm"
              >
                <option value="all">Semua Tamu ({photos.length})</option>
                {sortedLeaderboard.map(([name]) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredPhotos.length === 0 ? (
            <div className="bg-paper p-12 rounded-3xl border border-line text-center text-ink/70">
              <Camera className="w-10 h-10 text-sand mx-auto mb-2" />
              <p className="font-ui text-sm">Tidak ada foto yang sesuai dengan filter pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="polaroid-frame bg-paper p-2.5 rounded-2xl border border-line shadow-sm">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-sand mb-2">
                    <img src={photo.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-ink">
                    <span className="truncate font-bold">{photo.guestName}</span>
                    <div className="flex items-center gap-1">
                      <a href={photo.photoUrl} download className="rounded-lg bg-sand px-2 py-1 text-terracotta font-bold">Download</a>
                      <button onClick={() => moderatePhoto(photo.id, "hide")} className="inline-flex items-center gap-1 rounded-lg bg-sand px-2 py-1.5 text-ink font-bold" title={photo.isHiddenByHost ? "Tampilkan foto" : "Sembunyikan foto"}>
                        {photo.isHiddenByHost ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        <span>{photo.isHiddenByHost ? "Tampilkan" : "Sembunyikan"}</span>
                      </button>
                      <button onClick={() => moderatePhoto(photo.id, "delete")} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1.5 text-red-700 font-bold" title="Hapus foto"><Trash2 className="h-3.5 w-3.5" /><span>Hapus</span></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

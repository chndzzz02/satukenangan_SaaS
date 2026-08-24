"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera, QrCode, Download, Eye, EyeOff, ShieldCheck, CheckCircle2, Copy, Sparkles, LogOut, Trash2 } from "lucide-react";
import type { SatukenanganEvent, Photo } from "@/types";

export default function HostDashboardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const isJustCreated = searchParams.get("created") === "true";

  const [event, setEvent] = useState<SatukenanganEvent | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [slug]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const moderatePhoto = async (photoId: string, action: "hide" | "delete") => {
    if (action === "delete" && !window.confirm("Hapus foto ini dari album?")) return;
    const response = await fetch(`/api/host/photos/${photoId}?slug=${encodeURIComponent(slug)}`, { method: action === "hide" ? "PATCH" : "DELETE" });
    const data = await response.json();
    if (!response.ok || !data.success) { alert(data.error || "Aksi moderasi gagal."); return; }
    await fetchDashboardData();
  };

  const revealGallery = async () => {
    if (!window.confirm("Buka semua foto untuk seluruh tamu sekarang?")) return;
    const response = await fetch(`/api/host/events/${slug}/reveal`, { method: "POST" });
    const data = await response.json();
    if (!response.ok || !data.success) { alert(data.error || "Gagal membuka galeri."); return; }
    setEvent((current) => current ? { ...current, revealedAt: new Date().toISOString() } : current);
    await fetchDashboardData();
  };

  const copyGuestLink = () => {
    const url = `${window.location.origin}/events/${slug}`;
    navigator.clipboard.writeText(url);
    alert("Link acara berhasil disalin ke clipboard!");
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

  return (
    <main className="min-h-screen bg-cream text-ink">
      <Navbar />

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

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-line pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] bg-terracotta text-paper px-2.5 py-0.5 rounded-full font-bold uppercase">
                HOST DASHBOARD
              </span>
              <span className="font-mono text-[10px] bg-sand text-moss px-2 py-0.5 rounded font-bold uppercase">
                STATUS: {event.paymentStatus.toUpperCase()}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">{event.name}</h1>
            <p className="font-ui text-xs text-moss mt-1">
              Penyelenggara: <strong>{event.hostName}</strong> ({event.hostEmail}) | Preset: <strong>{event.presetId}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!event.revealedAt && (
              <button onClick={revealGallery} className="px-4 py-2.5 bg-mustard hover:bg-mustard-dark text-ink font-bold text-xs rounded-xl shadow-sm">
                Buka galeri sekarang
              </button>
            )}
            <button
              onClick={copyGuestLink}
              className="px-4 py-2.5 bg-paper hover:bg-cream border border-line text-ink font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Copy className="w-4 h-4 text-terracotta" />
              <span>Salin Link Tamu</span>
            </button>

            <a
              href={`/events/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-terracotta hover:bg-terracotta-hover text-paper font-bold text-xs rounded-xl shadow flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
                <span>Buka tampilan tamu</span>
            </a>
          </div>
        </div>

        {/* Dashboard Stat & QR Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* QR Code Printable Card (5 cols) */}
          <div className="md:col-span-5 bg-paper p-6 rounded-3xl border border-line shadow-xl text-center flex flex-col items-center">
            <h3 className="font-display text-lg font-bold text-ink mb-1">QR Code Siap Cetak</h3>
            <p className="font-ui text-xs text-ink/70 mb-4">
              Cetak QR Code ini dan letakkan di meja resepsi / tempat acara.
            </p>

            {/* QR Code Box */}
            <div className="polaroid-frame bg-cream p-4 rounded-2xl border border-line shadow-md mb-4">
              <img src={event.qrCodeUrl} alt="QR Code Acara" className="w-48 h-48 object-contain rounded" />
              <span className="font-mono text-[10px] text-ink/60 block mt-2">SCAN DENGAN KAMERA HP</span>
            </div>

            <a
              href={event.qrCodeUrl}
              download={`qrcode-${slug}.png`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-sand hover:bg-sand/80 text-ink font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-terracotta" />
              <span>Download Image QR Code (PNG)</span>
            </a>
          </div>

          {/* Statistics & Overview (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-paper rounded-2xl border border-line shadow-sm">
                <span className="font-mono text-xs text-moss uppercase">Total Foto Terkumpul</span>
                <div className="font-display text-3xl font-bold text-ink mt-1">{photos.length} Foto</div>
                <span className="font-mono text-[10px] text-terracotta mt-1 block">Foto siap dicuci</span>
              </div>

              <div className="p-5 bg-paper rounded-2xl border border-line shadow-sm">
                <span className="font-mono text-xs text-moss uppercase">Kapasitas Tamu</span>
                <div className="font-display text-3xl font-bold text-ink mt-1">{event.guestLimit} Tamu</div>
                <span className="font-mono text-[10px] text-moss mt-1 block">Paket Aktif</span>
              </div>
            </div>

            {/* Event Settings Summary */}
            <div className="p-6 bg-paper rounded-2xl border border-line shadow-sm space-y-3">
              <h4 className="font-display font-bold text-ink text-base">Konfigurasi Roll Acara:</h4>

              <div className="grid grid-cols-2 gap-2 text-xs font-ui text-ink/80">
                <div>
                  <span className="text-moss block">Pengalaman:</span>
                  <strong className="capitalize">{event.experienceType}</strong>
                </div>
                <div>
                  <span className="text-moss block">Preset Roll:</span>
                  <strong className="capitalize">{event.presetId}</strong>
                </div>
                <div>
                  <span className="text-moss block">Foto per Tamu:</span>
                  <strong>{event.photoLimitPerGuest} Foto</strong>
                </div>
                <div>
                  <span className="text-moss block">Tanggal Event:</span>
                  <strong>{new Date(event.eventDate).toLocaleDateString("id-ID")}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Moderation Gallery */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-display text-xl font-bold text-ink">
              Moderasi Foto Terkumpul ({photos.length})
            </h3>
            <span className="font-mono text-xs text-moss">Bisa diunduh oleh Host</span>
          </div>

          {photos.length === 0 ? (
            <div className="bg-paper p-12 rounded-3xl border border-line text-center text-ink/70">
              <Camera className="w-10 h-10 text-sand mx-auto mb-2" />
              <p className="font-ui text-sm">Belum ada foto yang dijepret tamu. Scan QR untuk mencoba jepretan pertama!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="polaroid-frame bg-paper p-2.5 rounded border border-line shadow-sm">
                  <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-sand mb-2">
                    <img src={photo.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-ink">
                    <span className="truncate">{photo.guestName}</span>
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

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import FlashOverlay from "@/components/FlashOverlay";
import ToastNotification, { ToastMessage, ToastType } from "@/components/ToastNotification";
import {
  Camera,
  RefreshCw,
  Download,
  Clock,
  Lock,
  Copy,
  SwitchCamera,
  Sparkles,
  ChevronRight,
  Film,
  Zap,
} from "lucide-react";
import type { SatukenanganEvent, Photo } from "@/types";

/**
 * Compress captured canvas/image client side before upload.
 * Reduces 5MB-10MB mobile photos to ~150KB-300KB for lightning fast uploads.
 */
function compressImageClientSide(
  dataUrl: string,
  maxWidth = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
  });
}

export default function GuestEventPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<SatukenanganEvent | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [loading, setLoading] = useState(true);

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

  // Guest State
  const [guestName, setGuestName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [guestFilter, setGuestFilter] = useState("all");
  const [remainingReveal, setRemainingReveal] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch Event Data
  const fetchEventData = async () => {
    try {
      const res = await fetch(`/api/events/${slug}`);
      const data = await res.json();
      if (data.success) {
        setEvent(data.event);
        setIsRevealed(data.isRevealed);
        setPhotos(data.photos || []);
        setPhotoCount(data.photoCount || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
    const savedName = localStorage.getItem(`guest_name_${slug}`);
    if (savedName) {
      setGuestName(savedName);
      setIsJoined(true);
    }
  }, [slug]);

  useEffect(() => {
    if (isRevealed || !event?.revealDateTime) return;
    const updateCountdown = () => setRemainingReveal(Math.max(0, new Date(event.revealDateTime).getTime() - Date.now()));
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [event, isRevealed]);

  useEffect(() => {
    if (!cameraStream || !videoRef.current || capturedImage) return;
    videoRef.current.srcObject = cameraStream;
    videoRef.current.play().catch(() => undefined);
    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [cameraStream, isCameraOpen, capturedImage]);

  // Handle Guest Name Submit
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    localStorage.setItem(`guest_name_${slug}`, guestName.trim());
    setIsJoined(true);
    addToast(`Selamat datang, ${guestName.trim()}! Roll kamera siap digunakan.`, "success");
  };

  // Web Camera Viewfinder Start / Switch
  const startCamera = async (mode: "environment" | "user" = facingMode) => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      setFacingMode(mode);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera tidak dapat diakses:", err);
      const fileInput = document.getElementById("fallback-camera-input");
      if (fileInput) fileInput.click();
    }
  };

  const toggleCameraFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    startCamera(nextMode);
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  // Capture Frame
  const snapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    window.dispatchEvent(new Event("trigger-camera-flash"));

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedImage(dataUrl);
    }
  };

  // Fallback File Upload
  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawUrl = event.target?.result as string;
        const compressed = await compressImageClientSide(rawUrl);
        setCapturedImage(compressed);
        setIsCameraOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Captured Photo to Server
  const handleSavePhoto = async () => {
    if (!capturedImage || !event) return;

    setUploading(true);
    try {
      // Compress image client side before network payload
      const compressedImage = await compressImageClientSide(capturedImage);

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          guestName,
          photoUrl: compressedImage,
          presetApplied: event.presetId || "portra400",
          caption,
        }),
      });

      const data = await res.json();
      if (data.success) {
        stopCamera();
        fetchEventData();
        addToast("Foto berhasil diambil dan disimpan ke roll acara!", "success");
      } else {
        addToast(data.error || "Gagal menyimpan foto.", "error");
      }
    } catch (err: any) {
      addToast(err.message || "Gagal menyimpan foto.", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center font-mono text-terracotta">
        <RefreshCw className="w-8 h-8 animate-spin mb-3 text-terracotta" />
        <span className="text-sm font-bold tracking-wider">MEMUAT ROLL ACARA...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-display text-2xl font-bold text-ink">Acara Tidak Ditemukan</h2>
        <p className="font-ui text-sm text-ink/70 mt-2">Pastikan URL QR Code yang Anda scan sudah benar.</p>
      </div>
    );
  }

  // Calculate Exposures Counter
  const myPhotosCount = photos.filter((p) => p.guestName === guestName).length;
  const photoLimit = event.photoLimitPerGuest || 24;

  // Step 1: Guest Login / Join View
  if (!isJoined) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center p-4">
        <ToastNotification toasts={toasts} onClose={removeToast} />
        <div className="w-full max-w-md bg-paper p-8 rounded-3xl border border-line shadow-2xl text-center relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-terracotta/10 rounded-full blur-2xl" />

          <div className="w-16 h-16 rounded-2xl bg-terracotta text-paper flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-white">
            <Camera className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand text-moss font-mono text-[10px] uppercase font-bold tracking-widest mb-3 border border-line">
            <Film size={12} /> DISPOSABLE CAMERA ROLL
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-1">
            {event.name}
          </h1>
          <p className="font-ui text-xs text-moss mb-6">
            Penyelenggara: <strong>{event.hostName}</strong> | Preset Film: <strong>{event.presetId.toUpperCase()}</strong>
          </p>

          <form onSubmit={handleJoin} className="space-y-4">
            <div className="text-left">
              <label className="block font-mono text-xs text-ink/80 font-bold mb-1.5">
                NAMA UNDANGAN / TAMU *
              </label>
              <input
                type="text"
                required
                placeholder="misal: Dimas & Nisa"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-3.5 bg-cream rounded-xl border border-line text-ink font-ui focus:outline-none focus:border-terracotta text-center font-bold text-base shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-terracotta hover:bg-terracotta-hover text-paper font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Masuk dan Jepret Kamera</span>
              <ChevronRight size={18} />
            </button>
          </form>

          <p className="font-ui text-[11px] text-ink/60 mt-5">
            Bebas jepret hingga <strong>{photoLimit} foto</strong> | Hasil foto dicuci otomatis
          </p>
        </div>
      </main>
    );
  }

  // Filter Photos List
  const uniqueGuests = Array.from(new Set(photos.map((p) => p.guestName)));
  const filteredPhotos = photos.filter((p) =>
    guestFilter === "all" ? true : p.guestName === guestFilter
  );

  return (
    <main className="min-h-screen bg-cream text-ink relative pb-24">
      <FlashOverlay />
      <ToastNotification toasts={toasts} onClose={removeToast} />

      {/* Hidden Fallback Camera File Input */}
      <input
        type="file"
        id="fallback-camera-input"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
      />

      <canvas ref={canvasRef} className="hidden" />

      {/* Event Header Banner */}
      <header className="bg-paper/90 backdrop-blur-md border-b border-line py-3 px-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-terracotta text-paper flex items-center justify-center font-bold text-xs shadow">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-ink leading-tight">{event.name}</h2>
              <div className="flex items-center gap-2 font-mono text-[10px] text-moss mt-0.5">
                <span>Tamu: <strong>{guestName}</strong></span>
                <span>•</span>
                <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                  {String(myPhotosCount).padStart(2, "0")} / {photoLimit} FRAME
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => startCamera()}
            className="bg-terracotta hover:bg-terracotta-hover text-paper font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Jepret Kamera</span>
          </button>
        </div>
      </header>

      {/* Web Camera Viewfinder Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-stone-950 z-50 flex flex-col justify-between p-4 animate-in fade-in duration-200">
          {/* Top Camera Controls */}
          <div className="flex items-center justify-between text-paper font-mono text-xs max-w-sm mx-auto w-full pt-2">
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-stone-800 text-amber-400 font-bold">
              <Zap size={12} className="text-amber-400" />
              <span>{String(myPhotosCount + 1).padStart(2, "0")} / {photoLimit} FRAME</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleCameraFacingMode}
                className="p-2 bg-stone-800/80 hover:bg-stone-700 rounded-full text-paper transition border border-stone-700"
                title="Alih Kamera Depan/Belakang"
              >
                <SwitchCamera size={18} />
              </button>
              <button
                onClick={stopCamera}
                className="px-3.5 py-1.5 bg-stone-800/80 hover:bg-stone-700 rounded-full text-paper text-xs font-bold border border-stone-700"
              >
                Tutup
              </button>
            </div>
          </div>

          {/* Viewfinder Video Stream Container */}
          <div className="relative my-auto aspect-[3/4] max-h-[68vh] w-full max-w-sm mx-auto bg-black rounded-3xl overflow-hidden border-4 border-stone-800 shadow-2xl flex items-center justify-center">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover filter contrast-[1.05] saturate-[1.1] ${
                  facingMode === "user" ? "scale-x-[-1]" : ""
                }`}
              />
            )}

            {/* Viewfinder Grid Overlay */}
            {!capturedImage && (
              <div className="absolute inset-0 pointer-events-none border border-white/20 m-6 rounded-xl grid grid-cols-3 grid-rows-3">
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10 flex items-center justify-center">
                  <div className="w-4 h-4 border border-amber-400/60 rounded-full" />
                </div>
                <div className="border-b border-white/10" />
              </div>
            )}
          </div>

          {/* Bottom Shutter Action Bar */}
          <div className="max-w-sm mx-auto w-full space-y-3 pb-4">
            {capturedImage ? (
              <div className="space-y-3 bg-paper p-4 rounded-2xl shadow-xl">
                <input
                  type="text"
                  placeholder="Tulis pesan ucapan singkat..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-cream text-ink text-xs rounded-xl border border-line focus:outline-none focus:border-terracotta"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="flex-1 py-3 bg-sand text-ink text-xs font-bold rounded-xl hover:bg-sand/80 transition"
                  >
                    Foto Ulang
                  </button>
                  <button
                    onClick={handleSavePhoto}
                    disabled={uploading}
                    className="flex-1 py-3 bg-terracotta hover:bg-terracotta-hover text-paper text-xs font-bold rounded-xl disabled:opacity-50 transition shadow-md"
                  >
                    {uploading ? "Menyimpan..." : "Simpan Ke Roll"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={snapPhoto}
                  className="w-20 h-20 rounded-full border-4 border-paper bg-terracotta shadow-2xl active:scale-90 transition-transform flex items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-paper/40" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content: Photo Locked vs Revealed State */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {!isRevealed ? (
          /* Locked "Cuci Film" Countdown Screen */
          <div className="bg-paper p-8 sm:p-12 rounded-3xl border border-line shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 border-2 border-amber-300 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-9 h-9" />
            </div>

            <div>
              <span className="font-mono text-xs text-moss uppercase tracking-widest bg-sand px-3.5 py-1 rounded-full font-bold">
                FOTO DALAM PROSES CUCI FILM
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-bold text-ink mt-4">
                Hasil foto masih dirahasiakan!
              </h3>
              <p className="font-ui text-sm text-ink/70 max-w-md mx-auto mt-2 leading-relaxed">
                Seluruh jepretan foto dari tamu disimpan aman di roll digital. Begitu hitung mundur selesai, galeri foto terbuka untuk semua orang!
              </p>
            </div>

            {/* Countdown Box */}
            <div className="p-5 bg-cream rounded-2xl border border-line inline-flex items-center gap-3 font-mono font-bold text-terracotta text-lg sm:text-2xl shadow-inner">
              <Clock className="w-7 h-7 animate-pulse text-terracotta" />
              <span>{remainingReveal > 0 ? `DICUCI - ${Math.floor(remainingReveal / 3600000)}j ${Math.floor((remainingReveal % 3600000) / 60000)}m ${Math.floor((remainingReveal % 60000) / 1000)}d` : "FILM SIAP DIBUKA..."}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => startCamera()}
                className="px-8 py-4 bg-terracotta hover:bg-terracotta-hover text-paper font-bold rounded-2xl shadow-xl text-base transition flex items-center gap-2 mx-auto"
              >
                <Camera className="w-5 h-5" />
                <span>Tambah Jepretan Foto</span>
              </button>
            </div>
          </div>
        ) : (
          /* Revealed Shared Photo Gallery */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  Roll foto acara <span className="text-terracotta">Telah Dicuci!</span>
                </h3>
                <p className="font-ui text-xs text-moss mt-0.5">
                  {photos.length} Foto Berhasil Terkumpul dari Seluruh Tamu Undangan
                </p>
              </div>

              {/* Guest Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-ink/70 font-bold">Filter Tamu:</span>
                <select
                  value={guestFilter}
                  onChange={(e) => setGuestFilter(e.target.value)}
                  className="px-3.5 py-2 bg-paper rounded-xl border border-line font-mono text-xs text-ink focus:outline-none shadow-sm"
                >
                  <option value="all">Semua Orang ({photos.length})</option>
                  {uniqueGuests.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Polaroid Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="polaroid-frame bg-paper p-3.5 rounded-2xl border border-line shadow-polaroid hover:rotate-0 transition-all"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-ink/60 mb-2">
                    <span className="font-bold text-terracotta">FRAME #{photo.frameNumber}</span>
                    <span className="uppercase text-[9px] bg-sand px-2 py-0.5 rounded font-bold">
                      {photo.presetApplied}
                    </span>
                  </div>

                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-sand shadow-inner">
                    <img
                      src={photo.photoUrl}
                      alt={photo.caption || "Guest Photo"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mt-3.5 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-ink block">
                        {photo.guestName}
                      </span>
                      {photo.caption && (
                        <p className="font-hand text-lg text-ink/80 leading-none mt-1">
                          &ldquo;{photo.caption}&rdquo;
                        </p>
                      )}
                    </div>

                    <a
                      href={photo.photoUrl}
                      download={`satukenangan-${event.slug}-${photo.frameNumber}.jpg`}
                      className="p-2.5 bg-sand text-ink hover:text-terracotta rounded-xl transition-colors shadow-sm"
                      title="Download Foto HD"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

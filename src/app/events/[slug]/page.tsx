"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import FlashOverlay from "@/components/FlashOverlay";
import { Camera, RefreshCw, Download, Sparkles, Clock, Lock, CheckCircle, Users, ArrowLeft, Heart, Film } from "lucide-react";
import type { SatukenanganEvent, Photo } from "@/types";

export default function GuestEventPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<SatukenanganEvent | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Guest State
  const [guestName, setGuestName] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
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
  };

  // Web Camera Viewfinder Start
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera tidak dapat diakses:", err);
      // Fallback: Trigger file input click if camera permission denied / not supported
      const fileInput = document.getElementById("fallback-camera-input");
      if (fileInput) fileInput.click();
    }
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
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedImage(dataUrl);
    }
  };

  // Fallback File Upload
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setIsCameraOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Captured Photo to Server
  const handleSavePhoto = async () => {
    if (!capturedImage) return;

    setUploading(true);
    try {
      const res = await fetch("/api/photos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          guestName,
          photoUrl: capturedImage,
          presetApplied: event?.presetId || "portra400",
          caption,
        }),
      });

      const data = await res.json();
      if (data.success) {
        stopCamera();
        fetchEventData();
        alert("Foto berhasil diambil dan disimpan ke roll acara!");
      }
    } catch (err) {
        alert("Foto berhasil diambil dan disimpan ke roll acara!");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-mono text-terracotta">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Memuat Roll Acara...</span>
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

  // Step 1: Guest Login / Join View
  if (!isJoined) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-paper p-8 rounded-3xl border border-line shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-terracotta text-paper flex items-center justify-center mx-auto mb-4 shadow-md">
            <Camera className="w-7 h-7" />
          </div>

          <span className="font-mono text-[10px] bg-sand text-moss px-3 py-1 rounded-full uppercase">
            SATUKENANGAN ROLL
          </span>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2 mb-1">
            {event.name}
          </h1>
          <p className="font-ui text-xs text-moss mb-6">
              Host: <strong>{event.hostName}</strong> | Preset: <strong>{event.presetId}</strong>
          </p>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-ink/80 font-bold text-left mb-1">
                Masukkan Nama / Panggilan Anda *
              </label>
              <input
                type="text"
                required
                placeholder="misal: Maya & Sahabat"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-3 bg-cream rounded-xl border border-line text-ink font-ui focus:outline-none focus:border-terracotta text-center font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-terracotta hover:bg-terracotta-hover text-paper font-bold rounded-full shadow-lg transition-all"
            >
              Masuk dan jepret foto
            </button>
          </form>

          <p className="font-ui text-[11px] text-ink/60 mt-4">
              Tanpa perlu instal aplikasi | Bebas jepret hingga {event.photoLimitPerGuest} foto
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
      <header className="bg-paper border-b border-line py-4 px-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-terracotta text-paper flex items-center justify-center font-bold text-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-ink leading-tight">{event.name}</h2>
              <p className="font-mono text-[10px] text-moss">
                Tamu: <strong>{guestName}</strong> | {photoCount} foto terkumpul
              </p>
            </div>
          </div>

          <button
            onClick={startCamera}
            className="bg-terracotta hover:bg-terracotta-hover text-paper font-bold text-xs px-4 py-2 rounded-full shadow flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Jepret Foto</span>
          </button>
        </div>
      </header>

      {/* Web Camera Viewfinder Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-ink z-50 flex flex-col justify-between p-4 animate-in fade-in">
          {/* Top Camera Controls */}
          <div className="flex items-center justify-between text-paper font-mono text-xs">
            <span className="text-mustard">FRAME 04A | {event.presetId.toUpperCase()}</span>
            <button onClick={stopCamera} className="px-3 py-1 bg-paper/20 rounded-full text-paper">
              Tutup
            </button>
          </div>

          {/* Viewfinder Video Stream Container */}
          <div className="relative my-auto aspect-[3/4] max-h-[70vh] w-full max-w-sm mx-auto bg-black rounded-2xl overflow-hidden border-2 border-sand/40 shadow-2xl flex items-center justify-center">
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover filter contrast-[1.05] saturate-[1.1]"
              />
            )}

            {/* Viewfinder Crosshair Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-white/20 m-4 rounded flex items-center justify-center">
              <div className="w-6 h-6 border-t-2 border-l-2 border-mustard" />
            </div>
          </div>

          {/* Bottom Shutter Action Bar */}
          <div className="max-w-sm mx-auto w-full space-y-3 pb-4">
            {capturedImage ? (
              <div className="space-y-3 bg-paper p-4 rounded-2xl">
                <input
                  type="text"
                  placeholder="Tulis pesan ucapan singkat..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 bg-cream text-ink text-xs rounded-lg border border-line focus:outline-none"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="flex-1 py-2.5 bg-sand text-ink text-xs font-bold rounded-xl"
                  >
                    Foto Ulang
                  </button>
                  <button
                    onClick={handleSavePhoto}
                    disabled={uploading}
                    className="flex-1 py-2.5 bg-terracotta text-paper text-xs font-bold rounded-xl disabled:opacity-50"
                  >
                    {uploading ? "Menyimpan..." : "Simpan foto"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={snapPhoto}
                  className="w-20 h-20 rounded-full border-4 border-paper bg-terracotta shadow-xl active:scale-90 transition-transform flex items-center justify-center"
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
          <div className="bg-paper p-8 rounded-3xl border border-line shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-mustard/20 text-mustard-dark flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="font-mono text-xs text-moss uppercase tracking-widest bg-sand px-3 py-1 rounded-full">
                FOTO DALAM PROSES CUCI FILM
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-3">
                Hasil foto masih dirahasiakan!
              </h3>
              <p className="font-ui text-sm text-ink/70 max-w-md mx-auto mt-2">
                Foto-foto yang dijepret seluruh tamu sedang disimpan aman di dalam kamera analog digital. Begitu hitung mundur selesai, galeri terbuka untuk semua orang!
              </p>
            </div>

            {/* Countdown Box */}
            <div className="p-4 bg-cream rounded-2xl border border-line inline-flex items-center gap-2 font-mono font-bold text-terracotta text-lg sm:text-2xl">
              <Clock className="w-6 h-6 animate-pulse" />
              <span>{remainingReveal > 0 ? `FILM DICUCI - ${Math.floor(remainingReveal / 3600000)}j ${Math.floor((remainingReveal % 3600000) / 60000)}m ${Math.floor((remainingReveal % 60000) / 1000)}d` : "FILM SIAP DIBUKA..."}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={startCamera}
                className="px-8 py-4 bg-terracotta hover:bg-terracotta-hover text-paper font-bold rounded-full shadow-lg text-base"
              >
                Tambah jepretan foto lagi
              </button>
            </div>
          </div>
        ) : (
          /* Revealed Shared Photo Gallery */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-ink">
                  Roll foto acara <span className="text-terracotta">Telah dicuci!</span>
                </h3>
                <p className="font-ui text-xs text-moss mt-0.5">
                  {photos.length} Foto Berhasil Terkumpul dari Seluruh Tamu Undangan
                </p>
              </div>

              {/* Guest Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-ink/70">Filter Tamu:</span>
                <select
                  value={guestFilter}
                  onChange={(e) => setGuestFilter(e.target.value)}
                  className="px-3 py-1.5 bg-paper rounded-lg border border-line font-mono text-xs text-ink focus:outline-none"
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
              {filteredPhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="polaroid-frame bg-paper p-3 rounded border border-line shadow-polaroid hover:rotate-0 transition-all"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-ink/60 mb-2">
                    <span className="font-bold text-terracotta">FRAME #{photo.frameNumber}</span>
                    <span className="uppercase text-[9px] bg-sand px-1.5 py-0.5 rounded">
                      {photo.presetApplied}
                    </span>
                  </div>

                  <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-sand">
                    <img
                      src={photo.photoUrl}
                      alt={photo.caption || "Guest Photo"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-ink block">
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
                      className="p-2 bg-sand text-ink hover:text-terracotta rounded-lg transition-colors"
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

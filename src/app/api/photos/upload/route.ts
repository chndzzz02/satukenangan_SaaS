import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEvent, addPhoto, joinGuest } from "@/lib/data";
import { PresetId } from "@/types";
import rateLimiter, { getClientIp } from "@/lib/rate-limiter";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BASE64_SIZE = 7_500_000; // ~5MB file size limit in base64 encoding

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = rateLimiter.check(`upload:${clientIp}`, 20, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak unggahan foto. Silakan tunggu sebentar." },
        { status: 429 }
      );
    }

    const { slug, guestName, photoUrl, presetApplied, caption } = await req.json();

    if (!slug || !guestName || !photoUrl) {
      return NextResponse.json(
        { success: false, error: "Slug, nama tamu, dan foto wajib diisi." },
        { status: 400 }
      );
    }

    // Sanitize guestName and caption
    const sanitizedGuestName = String(guestName).replace(/<[^>]*>?/gm, "").trim();
    const sanitizedCaption = caption ? String(caption).replace(/<[^>]*>?/gm, "").trim() : "";

    if (sanitizedGuestName.length < 2 || sanitizedGuestName.length > 100) {
      return NextResponse.json({ success: false, error: "Nama tamu tidak valid." }, { status: 400 });
    }

    // Strict photoUrl MIME type and size validation
    if (typeof photoUrl !== "string" || photoUrl.length > MAX_BASE64_SIZE) {
      return NextResponse.json({ success: false, error: "Ukuran foto terlalu besar (maksimal 5MB)." }, { status: 400 });
    }

    if (!photoUrl.startsWith("data:image/")) {
      return NextResponse.json({ success: false, error: "Format foto tidak valid. Harus data URI gambar." }, { status: 400 });
    }

    const mimeTypeMatch = photoUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
    if (!mimeTypeMatch || !ALLOWED_MIME_TYPES.includes(mimeTypeMatch[1].toLowerCase())) {
      return NextResponse.json({ success: false, error: "Tipe gambar tidak didukung. Gunakan JPG, PNG, atau WebP." }, { status: 400 });
    }

    const event = await getEvent(slug);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Acara tidak ditemukan." },
        { status: 404 }
      );
    }

    // Ensure unpaid events cannot accept uploads in production
    if (event.paymentStatus === "unpaid" && event.guestLimit > 5) {
      return NextResponse.json(
        { success: false, error: "Acara ini belum menyelesaikan pembayaran." },
        { status: 402 }
      );
    }

    if (event.status === "paused") {
      return NextResponse.json({ success: false, error: "Pengunggahan foto sedang dijeda sementara oleh Host." }, { status: 403 });
    }
    if (event.status === "completed") {
      return NextResponse.json({ success: false, error: "Acara ini telah ditutup oleh Host." }, { status: 403 });
    }

    const guest = await joinGuest(slug, sanitizedGuestName, cookies().get("satukenangan_guest_token")?.value);
    if (!guest) {
      return NextResponse.json({ success: false, error: "Session tamu tidak valid." }, { status: 401 });
    }
    if (guest.photosTakenCount >= event.photoLimitPerGuest) {
      return NextResponse.json({ success: false, error: "Batas foto acara untuk tamu ini sudah tercapai." }, { status: 409 });
    }

    const newPhoto = await addPhoto(slug, {
      eventId: event.id,
      guestName: sanitizedGuestName,
      photoUrl,
      presetApplied: (presetApplied as PresetId) || event.presetId,
      caption: sanitizedCaption,
    }, guest.id);

    return NextResponse.json({ success: true, photo: newPhoto });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

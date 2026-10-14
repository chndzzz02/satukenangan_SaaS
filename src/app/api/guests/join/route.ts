import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { joinGuest } from "@/lib/data";
import rateLimiter, { getClientIp } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = rateLimiter.check(`join:${clientIp}`, 15, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak percobaan. Silakan coba sebentar lagi." },
        { status: 429 }
      );
    }

    const { slug, guestName } = await req.json();
    if (typeof slug !== "string" || typeof guestName !== "string") {
      return NextResponse.json({ success: false, error: "Input tidak valid." }, { status: 400 });
    }

    // Sanitize guest name against HTML/XSS injection
    const sanitizedGuestName = guestName.replace(/<[^>]*>?/gm, "").trim();
    if (sanitizedGuestName.length < 2 || sanitizedGuestName.length > 100) {
      return NextResponse.json({ success: false, error: "Nama tamu minimal 2 karakter dan maksimal 100 karakter." }, { status: 400 });
    }

    const guest = await joinGuest(slug, sanitizedGuestName, cookies().get("satukenangan_guest_token")?.value);
    if (!guest) return NextResponse.json({ success: false, error: "Acara tidak ditemukan." }, { status: 404 });
    const response = NextResponse.json({ success: true, guest: { id: guest.id, guestName: guest.guestName, photosTakenCount: guest.photosTakenCount } });
    response.cookies.set("satukenangan_guest_token", guest.sessionToken, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Gagal masuk ke album." }, { status: 500 });
  }
}

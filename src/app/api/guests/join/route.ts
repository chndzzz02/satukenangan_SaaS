import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { joinGuest } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const { slug, guestName } = await req.json();
    if (typeof slug !== "string" || typeof guestName !== "string" || guestName.trim().length < 2 || guestName.length > 100) {
      return NextResponse.json({ success: false, error: "Nama tamu tidak valid." }, { status: 400 });
    }
    const guest = await joinGuest(slug, guestName.trim(), cookies().get("satukenangan_guest_token")?.value);
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

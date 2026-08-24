import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEvent, getPhotos, addPhoto, joinGuest } from "@/lib/data";
import { PresetId } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { slug, guestName, photoUrl, presetApplied, caption } = await req.json();

    if (!slug || !guestName || !photoUrl) {
      return NextResponse.json(
        { success: false, error: "Slug, nama tamu, dan foto wajib diisi." },
        { status: 400 }
      );
    }

    if (typeof guestName !== "string" || guestName.trim().length < 2 || guestName.length > 100) {
      return NextResponse.json({ success: false, error: "Nama tamu tidak valid." }, { status: 400 });
    }
    if (typeof photoUrl !== "string" || photoUrl.length > 10_000_000 ||
      (!photoUrl.startsWith("data:image/") && !/^https?:\/\//.test(photoUrl))) {
      return NextResponse.json({ success: false, error: "Format foto tidak valid." }, { status: 400 });
    }

    const event = await getEvent(slug);
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Acara tidak ditemukan." },
        { status: 404 }
      );
    }

    const guest = await joinGuest(slug, guestName.trim(), cookies().get("satukenangan_guest_token")?.value);
    if (!guest) {
      return NextResponse.json({ success: false, error: "Session tamu tidak valid." }, { status: 401 });
    }
    if (guest.photosTakenCount >= event.photoLimitPerGuest) {
      return NextResponse.json({ success: false, error: "Batas foto acara sudah tercapai." }, { status: 409 });
    }

    const newPhoto = await addPhoto(slug, {
      eventId: event.id,
      guestName,
      photoUrl,
      presetApplied: (presetApplied as PresetId) || event.presetId,
      caption: caption || "",
    });

    return NextResponse.json({ success: true, photo: newPhoto });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


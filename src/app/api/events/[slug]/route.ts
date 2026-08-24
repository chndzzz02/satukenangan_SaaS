import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEvent, getPhotos } from "@/lib/data";
import type { SatukenanganEvent } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const event = await getEvent(slug);

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Acara tidak ditemukan." },
        { status: 404 }
      );
    }

    const photos = await getPhotos(slug);

    if (new URL(req.url).searchParams.get("dashboard") === "true") {
      const ownerId = cookies().get("satukenangan_user_id")?.value;
      const eventOwnerId = event.hostUserId;
      if (!ownerId || (eventOwnerId && eventOwnerId !== ownerId)) {
        return NextResponse.json({ success: false, error: "Akses dashboard ditolak." }, { status: 403 });
      }
    }
    const isRevealed = Boolean(event.revealedAt) || new Date() >= new Date(event.revealDateTime);

    return NextResponse.json({
      success: true,
      event,
      photoCount: photos.length,
      isRevealed,
      photos: isRevealed ? photos.filter((p) => !p.isHiddenByHost) : [],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


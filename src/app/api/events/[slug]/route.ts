import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEvent, getPhotos, updateEventStatus } from "@/lib/data";
import { getAuthenticatedUser } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";

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
      if (isSupabaseConfigured) {
        const user = await getAuthenticatedUser(req);
        if (!user || (eventOwnerId && eventOwnerId !== user.id)) {
          return NextResponse.json({ success: false, error: "Akses dashboard ditolak." }, { status: 403 });
        }
      } else if (!ownerId || (eventOwnerId && eventOwnerId !== ownerId)) {
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const { status } = await req.json();

    if (!status || !["active", "paused", "completed"].includes(status)) {
      return NextResponse.json({ success: false, error: "Status acara tidak valid." }, { status: 400 });
    }

    const event = await getEvent(slug);
    if (!event) {
      return NextResponse.json({ success: false, error: "Acara tidak ditemukan." }, { status: 404 });
    }

    if (isSupabaseConfigured) {
      const user = await getAuthenticatedUser(req);
      if (!user || (event.hostUserId && event.hostUserId !== user.id)) {
        return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
      }
    }

    const updated = await updateEventStatus(slug, status);
    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

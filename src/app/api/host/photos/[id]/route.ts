import { NextRequest, NextResponse } from "next/server";
import { deletePhoto, getEvent, togglePhotoVisibility } from "@/lib/data";
import { getAuthenticatedUser } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";

async function authorize(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return false;
  const event = await getEvent(slug);
  if (!event) return false;

  if (isSupabaseConfigured) {
    const user = await getAuthenticatedUser(req);
    if (!user) return false;
    return Boolean(!event.hostUserId || event.hostUserId === user.id);
  }
  return true;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await authorize(req))) return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    const slug = new URL(req.url).searchParams.get("slug") as string;
    const updated = await togglePhotoVisibility(slug, params.id);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Gagal mengubah visibilitas foto." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!(await authorize(req))) return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    const slug = new URL(req.url).searchParams.get("slug") as string;
    const deleted = await deletePhoto(slug, params.id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Gagal menghapus foto." }, { status: 500 });
  }
}

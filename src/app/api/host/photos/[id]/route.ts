import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deletePhoto, getEvent, togglePhotoVisibility } from "@/lib/data";

async function authorize(req: NextRequest) {
  const ownerId = cookies().get("satukenangan_user_id")?.value;
  const slug = new URL(req.url).searchParams.get("slug");
  if (!ownerId || !slug) return false;
  const event = await getEvent(slug);
  return Boolean(event && (!event.hostUserId || event.hostUserId === ownerId));
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

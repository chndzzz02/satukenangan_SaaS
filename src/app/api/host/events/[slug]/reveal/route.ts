import { NextRequest, NextResponse } from "next/server";
import { getEvent, revealEvent } from "@/lib/data";
import { getAuthenticatedUser } from "@/lib/supabase-server";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const event = await getEvent(params.slug);
    if (!event) {
      return NextResponse.json({ success: false, error: "Event tidak ditemukan." }, { status: 404 });
    }

    if (isSupabaseConfigured) {
      const user = await getAuthenticatedUser(req);
      if (!user || (event.hostUserId && event.hostUserId !== user.id)) {
        return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
      }
    }

    const updated = await revealEvent(params.slug);
    return NextResponse.json({ success: Boolean(updated), event: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Gagal membuka galeri." }, { status: 500 });
  }
}

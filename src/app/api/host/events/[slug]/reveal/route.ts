import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEvent, revealEvent } from "@/lib/data";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const userId = cookies().get("satukenangan_user_id")?.value;
    const event = await getEvent(params.slug);
    if (!userId || !event || (event.hostUserId && event.hostUserId !== userId)) {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }
    const updated = await revealEvent(params.slug);
    return NextResponse.json({ success: Boolean(updated), event: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Gagal membuka galeri." }, { status: 500 });
  }
}

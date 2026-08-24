import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getEvents, createEvent } from "@/lib/data";
import { CreateEventInput } from "@/types";

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<CreateEventInput> = await req.json();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validGuestLimits = [5, 50, 100, 200, 9999];
    const validExperienceTypes = ["camera", "guestbook"];
    const validRevealTypes = ["during", "immediately", "custom"];

    if (typeof body.name !== "string" || body.name.trim().length < 2 ||
      typeof body.hostName !== "string" || body.hostName.trim().length < 2 ||
      typeof body.hostEmail !== "string" || !emailPattern.test(body.hostEmail) ||
      !validExperienceTypes.includes(body.experienceType || "") ||
      !validRevealTypes.includes(body.revealTimeType || "") ||
      !validGuestLimits.includes(body.guestLimit || 0) ||
      typeof body.photoLimitPerGuest !== "number" || body.photoLimitPerGuest < 1 || body.photoLimitPerGuest > 100) {
      return NextResponse.json(
        { success: false, error: "Nama acara, nama host, dan email wajib diisi." },
        { status: 400 }
      );
    }

    const hostUserId = cookies().get("satukenangan_user_id")?.value;
    const newEvent = await createEvent(body as CreateEventInput, hostUserId);
    return NextResponse.json({ success: true, event: newEvent });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


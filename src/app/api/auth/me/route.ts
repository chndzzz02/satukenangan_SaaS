import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  return NextResponse.json({ success: true, user });
}

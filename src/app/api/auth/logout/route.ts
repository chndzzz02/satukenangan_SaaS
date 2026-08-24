import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("satukenangan_access_token");
  response.cookies.delete("satukenangan_user_id");
  return response;
}

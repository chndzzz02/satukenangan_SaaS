import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ success: false, error: "Supabase Auth belum dikonfigurasi." }, { status: 503 });
    }
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return NextResponse.json({ success: false, error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.error_description || data.msg || "Login gagal." }, { status: 401 });
    }

    const result = NextResponse.json({ success: true, user: data.user });
    result.cookies.set("satukenangan_access_token", data.access_token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: data.expires_in,
    });
    result.cookies.set("satukenangan_user_id", data.user.id, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: data.expires_in,
    });
    return result;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Login gagal." }, { status: 500 });
  }
}

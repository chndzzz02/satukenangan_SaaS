import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !anonKey) return NextResponse.json({ success: false, error: "Supabase Auth belum dikonfigurasi." }, { status: 503 });
    if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ success: false, error: "Email valid dan password minimal 6 karakter wajib diisi." }, { status: 400 });
    }
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST", headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), cache: "no-store",
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ success: false, error: data.msg || data.error_description || "Registrasi gagal." }, { status: 400 });
    return NextResponse.json({ success: true, requiresConfirmation: !data.access_token });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Registrasi gagal." }, { status: 500 });
  }
}

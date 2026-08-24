import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const verifier = req.cookies.get("satukenangan_pkce_verifier")?.value;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!code || !verifier || !supabaseUrl || !anonKey) {
    return NextResponse.redirect(new URL("/login?error=google_callback", req.url));
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce`, {
    method: "POST", headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ auth_code: code, code_verifier: verifier }), cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok || !data.access_token || !data.user?.id) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(data.msg || "google_login_failed")}`, req.url));
  }

  const redirect = NextResponse.redirect(new URL("/create", req.url));
  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: data.expires_in };
  redirect.cookies.set("satukenangan_access_token", data.access_token, options);
  redirect.cookies.set("satukenangan_user_id", data.user.id, options);
  redirect.cookies.delete("satukenangan_pkce_verifier");
  return redirect;
}

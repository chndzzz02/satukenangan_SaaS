import { NextRequest } from "next/server";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Verifies Supabase JWT access token from request cookies or Authorization header.
 * Returns the authenticated user object if valid, or null if invalid/expired/not configured.
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    if (!supabaseUrl || !anonKey) {
      return null;
    }

    // Get token from cookie or Authorization header
    let token = req.cookies.get("satukenangan_access_token")?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    // Verify token with Supabase Auth /auth/v1/user endpoint
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    if (!userData || !userData.id) {
      return null;
    }

    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    };
  } catch (error) {
    console.error("Error verifying authentication token:", error);
    return null;
  }
}

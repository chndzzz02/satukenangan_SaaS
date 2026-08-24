import type { Photo, SatukenanganEvent } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && serviceRoleKey);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase request gagal (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export async function getPersistentEvent(slug: string) {
  const rows = await request<SatukenanganEvent[]>(`events?slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0];
}

export async function getPersistentPhotos(eventId: string) {
  return request<Photo[]>(`photos?event_id=eq.${encodeURIComponent(eventId)}&order=created_at.desc`);
}

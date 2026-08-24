import type { CreateEventInput, Photo, SatukenanganEvent } from "@/types";
import { randomUUID } from "crypto";
import store from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers() {
  return {
    apikey: key || "",
    Authorization: `Bearer ${key || ""}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function fromRow(row: any): SatukenanganEvent {
  return {
    id: row.id, slug: row.slug, name: row.name, hostName: row.host_name, hostUserId: row.host_user_id || undefined,
    hostEmail: row.host_email, experienceType: row.experience_type, presetId: row.preset_id,
    eventDate: row.event_date, revealTimeType: row.reveal_time_type,
    revealDateTime: row.reveal_date_time, revealedAt: row.revealed_at || undefined, guestLimit: row.guest_limit,
    photoLimitPerGuest: row.photo_limit_per_guest, status: row.status,
    paymentStatus: row.payment_status, price: row.price, qrCodeUrl: row.qr_code_url,
    createdAt: row.created_at,
  };
}

function photoFromRow(row: any): Photo {
  return {
    id: row.id, eventId: row.event_id, guestName: row.guest_name, photoUrl: row.photo_url,
    presetApplied: row.preset_applied, frameNumber: row.frame_number,
    isRevealed: row.is_revealed, isHiddenByHost: row.is_hidden_by_host,
    caption: row.caption || undefined, createdAt: row.created_at,
  };
}

async function uploadPhotoToStorage(photoUrl: string, eventId: string, photoId: string) {
  if (!baseUrl || !key || !photoUrl.startsWith("data:image/")) return photoUrl;

  const match = photoUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw new Error("Format data foto tidak valid.");

  const contentType = match[1];
  const extension = contentType.split("/")[1].split("+")[0].replace("jpeg", "jpg");
  const objectPath = `${eventId}/${photoId}.${extension}`;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "event-photos";
  const response = await fetch(`${baseUrl}/storage/v1/object/${bucket}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: Buffer.from(match[2], "base64"),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Upload Storage gagal (${response.status}): ${detail || "Periksa bucket dan permission."}`);
  }

  return `${baseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...init, headers: { ...headers(), ...init?.headers }, cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request gagal (${response.status}): ${detail || "Periksa URL, key, dan schema database."}`);
  }
  return response.json() as Promise<T>;
}

export async function revealEvent(slug: string) {
  if (!isSupabaseConfigured) return undefined;
  const rows = await request<any[]>(`events?slug=eq.${encodeURIComponent(slug)}`, { method: "PATCH", body: JSON.stringify({ revealed_at: new Date().toISOString() }) });
  return rows[0] ? fromRow(rows[0]) : undefined;
}

export async function togglePhotoVisibility(slug: string, photoId: string) {
  if (!isSupabaseConfigured) return store.toggleHidePhoto(slug, photoId);
  const event = await getEvent(slug);
  if (!event) return false;
  const photos = await request<any[]>(`photos?id=eq.${encodeURIComponent(photoId)}&event_id=eq.${encodeURIComponent(event.id)}&limit=1`);
  if (!photos[0]) return false;
  const rows = await request<any[]>(`photos?id=eq.${encodeURIComponent(photoId)}&event_id=eq.${encodeURIComponent(event.id)}`, { method: "PATCH", body: JSON.stringify({ is_hidden_by_host: !photos[0].is_hidden_by_host }) });
  return Boolean(rows[0]);
}

export async function deletePhoto(slug: string, photoId: string) {
  if (!isSupabaseConfigured) return store.deletePhoto(slug, photoId);
  const event = await getEvent(slug);
  if (!event) return false;
  const response = await fetch(`${baseUrl}/rest/v1/photos?id=eq.${encodeURIComponent(photoId)}&event_id=eq.${encodeURIComponent(event.id)}`, { method: "DELETE", headers: headers(), cache: "no-store" });
  return response.ok;
}
export async function updatePaymentStatus(slug: string, status: "paid" | "unpaid" | "free") {
  if (!isSupabaseConfigured) return store.updatePaymentStatus(slug, status);
  const rows = await request<any[]>(`events?slug=eq.${encodeURIComponent(slug)}`, { method: "PATCH", body: JSON.stringify({ payment_status: status }) });
  return rows[0] ? fromRow(rows[0]) : undefined;
}
export async function getEvents() {
  if (!isSupabaseConfigured) return store.getAllEvents();
  const rows = await request<any[]>("events?select=*&order=created_at.desc");
  return rows.map(fromRow);
}

export async function getEvent(slug: string) {
  if (!isSupabaseConfigured) return store.getEvent(slug);
  const rows = await request<any[]>(`events?slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] ? fromRow(rows[0]) : undefined;
}

export async function getPhotos(slug: string) {
  if (!isSupabaseConfigured) return store.getPhotos(slug);
  const event = await getEvent(slug);
  if (!event) return [];
  const rows = await request<any[]>(`photos?event_id=eq.${encodeURIComponent(event.id)}&order=created_at.desc`);
  const revealed = Boolean(event.revealedAt) || new Date() >= new Date(event.revealDateTime);
  return rows.map(photoFromRow).map((photo) => ({ ...photo, isRevealed: revealed || photo.isRevealed }));
}

export async function createEvent(input: CreateEventInput, hostUserId?: string) {
  if (!isSupabaseConfigured) return store.createEvent(input);
  const fallback = store.createEvent(input);
  const row = await request<any[]>("events", { method: "POST", body: JSON.stringify({
    id: fallback.id, slug: fallback.slug, name: fallback.name, host_user_id: hostUserId || null, host_name: fallback.hostName,
    host_email: fallback.hostEmail, experience_type: fallback.experienceType, preset_id: fallback.presetId,
    event_date: fallback.eventDate, reveal_time_type: fallback.revealTimeType,
    reveal_date_time: fallback.revealDateTime, guest_limit: fallback.guestLimit,
    photo_limit_per_guest: fallback.photoLimitPerGuest, status: fallback.status,
    payment_status: fallback.paymentStatus, price: fallback.price, qr_code_url: fallback.qrCodeUrl,
  }) });
  return row[0] ? fromRow(row[0]) : fallback;
}

export async function joinGuest(slug: string, guestName: string, sessionToken?: string) {
  const event = await getEvent(slug);
  if (!event) return undefined;
  if (!isSupabaseConfigured) return { id: `guest_${Date.now()}`, eventId: event.id, guestName, photosTakenCount: 0, sessionToken: sessionToken || randomUUID() };

  if (sessionToken) {
    const existing = await request<any[]>(`guests?event_id=eq.${encodeURIComponent(event.id)}&session_token=eq.${encodeURIComponent(sessionToken)}&limit=1`);
    if (existing[0]) return { id: existing[0].id, eventId: event.id, guestName: existing[0].guest_name, photosTakenCount: existing[0].photos_taken_count, sessionToken: existing[0].session_token };
  }

  const token = sessionToken || randomUUID();
  const rows = await request<any[]>("guests", { method: "POST", body: JSON.stringify({
    id: `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`, event_id: event.id,
    guest_name: guestName, session_token: token, photos_taken_count: 0,
  }) });
  const row = rows[0];
  return row ? { id: row.id, eventId: event.id, guestName: row.guest_name, photosTakenCount: row.photos_taken_count, sessionToken: row.session_token } : undefined;
}
export async function addPhoto(slug: string, input: Omit<Photo, "id" | "createdAt" | "frameNumber" | "isRevealed">, guestId?: string) {
  if (!isSupabaseConfigured) return store.addPhoto(slug, input);
  const event = await getEvent(slug);
  if (!event) return undefined;
  const existing = await getPhotos(slug);
  const frameNumber = `${String(existing.length + 1).padStart(2, "0")}A`;
  const photoId = `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const storedPhotoUrl = await uploadPhotoToStorage(input.photoUrl, event.id, photoId);
  const photo = { ...input, id: photoId, eventId: event.id, photoUrl: storedPhotoUrl,
    frameNumber, isRevealed: new Date() >= new Date(event.revealDateTime), createdAt: new Date().toISOString() };
  const rows = await request<any[]>("photos", { method: "POST", body: JSON.stringify({
    id: photo.id, event_id: photo.eventId, guest_id: guestId || null, guest_name: photo.guestName, photo_url: photo.photoUrl,
    preset_applied: photo.presetApplied, frame_number: photo.frameNumber, is_revealed: photo.isRevealed,
    is_hidden_by_host: photo.isHiddenByHost || false, caption: photo.caption || null,
  }) });
  if (guestId) {
    await request<any[]>(`guests?id=eq.${encodeURIComponent(guestId)}`, { method: "PATCH", body: JSON.stringify({ photos_taken_count: existing.length + 1 }) });
  }
  return rows[0] ? photoFromRow(rows[0]) : photo;
}

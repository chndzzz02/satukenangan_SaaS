export type ExperienceType = "camera" | "guestbook";

export type PresetId =
  | "portra400"
  | "cinestill800t"
  | "funsaver"
  | "quicksnap"
  | "hp5plus"
  | "ektar100";

export interface FilmPreset {
  id: PresetId;
  name: string;
  code: string;
  tagline: string;
  filterStyle: string;
  cssFilter: string;
}

export type RevealTimeType = "during" | "immediately" | "custom";

export interface SatukenanganEvent {
  id: string;
  slug: string; // e.g. "pernikahan-emma-noah"
  name: string;
  hostName: string;
  hostEmail: string;
  hostUserId?: string;
  experienceType: ExperienceType;
  presetId: PresetId;
  eventDate: string; // ISO date string
  revealTimeType: RevealTimeType;
  revealDateTime: string; // ISO date string when photos are revealed
  revealedAt?: string;
  guestLimit: number; // 5, 50, 100, 200, 9999
  photoLimitPerGuest: number; // e.g. 24
  status: "active" | "draft" | "completed";
  paymentStatus: "unpaid" | "paid" | "free";
  price: number;
  qrCodeUrl: string;
  createdAt: string;
}

export interface Guest {
  id: string;
  eventId: string;
  guestName: string;
  photosTakenCount: number;
  createdAt: string;
}

export interface Photo {
  id: string;
  eventId: string;
  guestName: string;
  photoUrl: string; // base64 or storage URL
  presetApplied: PresetId;
  frameNumber: string; // e.g. "04A"
  isRevealed: boolean;
  isHiddenByHost?: boolean;
  caption?: string;
  createdAt: string;
}

export interface CreateEventInput {
  name: string;
  hostName: string;
  hostEmail: string;
  hostUserId?: string;
  experienceType: ExperienceType;
  presetId: PresetId;
  eventDate: string;
  revealTimeType: RevealTimeType;
  revealDateTime: string;
  guestLimit: number;
  photoLimitPerGuest: number;
}

export interface PaymentSnapResponse {
  snapToken: string;
  redirectUrl: string;
}

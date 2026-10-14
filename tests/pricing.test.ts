import { describe, it, expect } from "vitest";

function calculatePriceByGuestLimit(guestLimit: number): number {
  if (guestLimit <= 5) return 0;
  if (guestLimit <= 50) return 149000;
  if (guestLimit <= 100) return 279000;
  if (guestLimit <= 200) return 449000;
  return 799000;
}

function canTakeMorePhotos(photosTakenCount: number, limitPerGuest: number): boolean {
  return photosTakenCount < limitPerGuest;
}

describe("Pricing & Guest Quota Logic", () => {
  it("should calculate correct price for 5 guests (Free tier)", () => {
    expect(calculatePriceByGuestLimit(5)).toBe(0);
  });

  it("should calculate correct price for 50 guests (Medium tier)", () => {
    expect(calculatePriceByGuestLimit(50)).toBe(149000);
  });

  it("should calculate correct price for 100 guests (Large tier)", () => {
    expect(calculatePriceByGuestLimit(100)).toBe(279000);
  });

  it("should calculate correct price for 200 guests (Extra Large tier)", () => {
    expect(calculatePriceByGuestLimit(200)).toBe(449000);
  });

  it("should calculate correct price for 9999 guests (Unlimited tier)", () => {
    expect(calculatePriceByGuestLimit(9999)).toBe(799000);
  });

  it("should allow guest to take photos when under photo limit", () => {
    expect(canTakeMorePhotos(5, 24)).toBe(true);
    expect(canTakeMorePhotos(23, 24)).toBe(true);
  });

  it("should deny guest from taking photos when photo limit reached", () => {
    expect(canTakeMorePhotos(24, 24)).toBe(false);
    expect(canTakeMorePhotos(25, 24)).toBe(false);
  });
});

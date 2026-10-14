import { describe, it, expect } from "vitest";

function isGalleryRevealed(revealDateTimeISO: string, revealedAtISO?: string): boolean {
  if (revealedAtISO) return true;
  return new Date() >= new Date(revealDateTimeISO);
}

describe("Gallery Reveal Status Logic", () => {
  it("should be locked when current time is before revealDateTime and revealedAt is undefined", () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString(); // 1 day in future
    expect(isGalleryRevealed(futureDate)).toBe(false);
  });

  it("should be revealed when current time is after revealDateTime", () => {
    const pastDate = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
    expect(isGalleryRevealed(pastDate)).toBe(true);
  });

  it("should be revealed immediately if manual revealedAt timestamp is set", () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const manualRevealTime = new Date().toISOString();
    expect(isGalleryRevealed(futureDate, manualRevealTime)).toBe(true);
  });
});

import { describe, it, expect } from "vitest";

class MemoryRateLimiter {
  private store: Map<string, { count: number; resetAt: number }> = new Map();

  public check(key: string, limit: number, windowMs = 60000) {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetAt <= now) {
      this.store.set(key, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
      return { success: false, remaining: 0 };
    }

    record.count += 1;
    this.store.set(key, record);
    return { success: true, remaining: limit - record.count };
  }
}

function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>?/gm, "").trim();
}

describe("Security Rate Limiting & Input Sanitization", () => {
  it("should allow requests under the specified rate limit", () => {
    const limiter = new MemoryRateLimiter();
    const ip = "192.168.1.1";

    expect(limiter.check(ip, 3).success).toBe(true);
    expect(limiter.check(ip, 3).success).toBe(true);
    expect(limiter.check(ip, 3).success).toBe(true);
  });

  it("should block requests when rate limit is exceeded", () => {
    const limiter = new MemoryRateLimiter();
    const ip = "192.168.1.2";

    limiter.check(ip, 2);
    limiter.check(ip, 2);
    expect(limiter.check(ip, 2).success).toBe(false);
  });

  it("should strip HTML and script tags from user inputs", () => {
    const maliciousName = "<script>alert('xss')</script> Budi Pratama";
    expect(sanitizeInput(maliciousName)).toBe("alert('xss') Budi Pratama");

    const htmlCaption = "<b>Selamat Pernikahan!</b>";
    expect(sanitizeInput(htmlCaption)).toBe("Selamat Pernikahan!");
  });
});

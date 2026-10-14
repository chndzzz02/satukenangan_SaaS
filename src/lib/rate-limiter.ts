interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class MemoryRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every 5 minutes
    if (typeof window === "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  private cleanup() {
    const now = Date.now();
    this.store.forEach((record, key) => {
      if (record.resetAt <= now) {
        this.store.delete(key);
      }
    });
  }

  /**
   * Check if a request identified by key is rate limited.
   * @param key Identifier (e.g., client IP + route path)
   * @param limit Maximum allowed requests in window
   * @param windowMs Time window in milliseconds (default: 60,000ms = 1 min)
   * @returns { success: boolean, remaining: number, resetAt: number }
   */
  public check(key: string, limit: number, windowMs = 60000): { success: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetAt <= now) {
      const newRecord: RateLimitRecord = {
        count: 1,
        resetAt: now + windowMs,
      };
      this.store.set(key, newRecord);
      return { success: true, remaining: limit - 1, resetAt: newRecord.resetAt };
    }

    if (record.count >= limit) {
      return { success: false, remaining: 0, resetAt: record.resetAt };
    }

    record.count += 1;
    this.store.set(key, record);
    return { success: true, remaining: limit - record.count, resetAt: record.resetAt };
  }
}

const rateLimiter = new MemoryRateLimiter();

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

export default rateLimiter;

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 3, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(identifier);

    if (!entry) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return false;
    }

    if (now - entry.firstAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return false;
    }

    entry.count++;

    if (entry.count > this.maxAttempts) {
      return false;
    }

    return false;
  }

  getRemainingTime(identifier: string): number {
    const entry = this.attempts.get(identifier);
    if (!entry) return 0;

    const elapsed = Date.now() - entry.firstAttempt;
    return Math.max(0, this.windowMs - elapsed);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now - entry.firstAttempt > this.windowMs) {
        this.attempts.delete(key);
      }
    }
  }
}

export const commentRateLimiter = new RateLimiter();

if (typeof window === "undefined") {
  setInterval(
    () => {
      commentRateLimiter.cleanup();
    },
    5 * 60 * 1000
  );
}

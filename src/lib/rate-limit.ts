/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Suitable for a single-instance deployment. For multi-instance setups,
 * swap this for a shared store (Redis, etc.) with the same interface.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit = 60,
  windowMs = 60_000,
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    prune();
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }
  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

function prune() {
  const now = Date.now();
  if (buckets.size < 10_000) return;
  buckets.forEach((bucket, key) => {
    if (bucket.resetAt <= now) buckets.delete(key);
  });
}
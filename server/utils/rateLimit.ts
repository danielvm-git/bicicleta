import type { H3Event } from "h3";
import { getRequestIP } from "h3";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function prune() {
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (now > b.resetAt) {
      buckets.delete(k);
    }
  }
}

/**
 * In-memory fixed window. Best for single Node process; for serverless, prefer Redis.
 */
export function checkRateLimit(
  event: H3Event,
  key: string,
  max: number,
  windowMs: number
) {
  const config = useRuntimeConfig(event);
  const w =
    (config as { rateLimitWindowMs?: number }).rateLimitWindowMs ?? 60_000;
  const win = windowMs > 0 ? windowMs : w;
  if (max <= 0) {
    return;
  }
  prune();
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  const id = `${ip}:${key}`;
  const now = Date.now();
  let b = buckets.get(id);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + win };
    buckets.set(id, b);
  }
  b.count += 1;
  if (b.count > max) {
    const retryAfter = Math.max(0, Math.ceil((b.resetAt - now) / 1000));
    throw createError({
      statusCode: 429,
      statusMessage: "Too many requests",
      data: { retryAfter },
    });
  }
}

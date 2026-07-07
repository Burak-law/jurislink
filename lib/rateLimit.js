import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Fallback to in-memory if Redis is not configured properly yet
const fallbackBuckets = new Map();

export async function rateLimit(key, limit, windowMs) {
  // Use Upstash Redis if available
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const redis = Redis.fromEnv();
      
      // Calculate sliding window duration string (e.g. "60 s")
      const windowSecs = Math.ceil(windowMs / 1000);
      const windowStr = `${windowSecs} s`;
      
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, windowStr),
        analytics: false,
        prefix: "@upstash/ratelimit/jurislink",
      });
      
      const { success, remaining, reset } = await ratelimit.limit(key);
      return {
        success,
        remaining,
        retryAfterSeconds: success ? 0 : Math.ceil((reset - Date.now()) / 1000),
      };
    } catch (error) {
      console.error("Redis Ratelimit Error:", error);
      // Fallback below if Redis fails
    }
  }

  // Fallback in-memory implementation
  const now = Date.now();
  const bucket = fallbackBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    fallbackBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count };
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

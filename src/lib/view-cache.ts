const CACHE_KEY = "blog_view_counts_cache";
const CACHE_DURATION_MINUTES = 5;

interface CacheEntry {
  count: number;
  timestamp: number;
}

interface ViewCache {
  [slug: string]: CacheEntry;
}

export function getCachedViewCount(slug: string): number | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const cache: ViewCache = JSON.parse(cached);
    const entry = cache[slug];

    if (!entry) return null;

    const now = Date.now();
    const ageMinutes = (now - entry.timestamp) / (1000 * 60);

    if (ageMinutes > CACHE_DURATION_MINUTES) {
      delete cache[slug];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      return null;
    }

    return entry.count;
  } catch (error) {
    console.warn("Cache read error:", error);
    return null;
  }
}

export function setCachedViewCount(slug: string, count: number): void {
  if (typeof window === "undefined") return;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cache: ViewCache = cached ? JSON.parse(cached) : {};

    cache[slug] = {
      count,
      timestamp: Date.now(),
    };

    // Clean up old entries while we're at it
    const now = Date.now();
    Object.keys(cache).forEach((key) => {
      const ageMinutes = (now - cache[key].timestamp) / (1000 * 60);
      if (ageMinutes > CACHE_DURATION_MINUTES) {
        delete cache[key];
      }
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn("Cache write error:", error);
  }
}

export function clearViewCache(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn("Cache clear error:", error);
  }
}

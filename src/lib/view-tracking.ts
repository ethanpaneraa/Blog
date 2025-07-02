const STORAGE_KEY = "blog_post_views";
const VIEW_COOLDOWN_HOURS = 24;
const MAX_STORED_VIEWS = 100;

interface ViewData {
  [slug: string]: number;
}

export function checkShouldIncrement(slug: string): boolean {
  if (typeof window === "undefined") return true;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;

    const viewData: ViewData = JSON.parse(stored);
    const lastViewed = viewData[slug];

    if (!lastViewed) return true;

    const now = Date.now();
    const timeDiff = now - lastViewed;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return hoursDiff >= VIEW_COOLDOWN_HOURS;
  } catch (error) {
    console.warn("localStorage error:", error);
    return true;
  }
}

export function recordView(slug: string): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let viewData: ViewData = stored ? JSON.parse(stored) : {};

    const entries = Object.entries(viewData);
    if (entries.length >= MAX_STORED_VIEWS) {
      const sorted = entries.sort(([, a], [, b]) => b - a);
      viewData = Object.fromEntries(sorted.slice(0, MAX_STORED_VIEWS - 1));
    }

    viewData[slug] = Date.now();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewData));
  } catch (error) {
    console.warn("Failed to record view in localStorage:", error);
  }
}

export function getLastViewTime(slug: string): Date | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const viewData: ViewData = JSON.parse(stored);
    const timestamp = viewData[slug];

    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.warn("localStorage error:", error);
    return null;
  }
}

export function clearViewHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear view history:", error);
  }
}

export function getViewHistory(): ViewData {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn("localStorage error:", error);
    return {};
  }
}

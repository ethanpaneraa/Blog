"use client";

import { useViewCounter } from "@/app/hooks/use-view-counter";

interface ViewCounterProps {
  slug: string;
  initialCount?: number;
}

export function ViewCounter({ slug, initialCount = 0 }: ViewCounterProps) {
  const { viewCount, isLoading } = useViewCounter(slug, initialCount);
  const displayCount = isLoading ? initialCount : viewCount;

  return (
    <span className="text-sm text-gray-400">
      • {displayCount} {displayCount === 1 ? "view" : "views"}
    </span>
  );
}

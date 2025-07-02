"use client";

import { useEffect, useState } from "react";
import { checkShouldIncrement, recordView } from "@/lib/view-tracking";
import { getCachedViewCount, setCachedViewCount } from "@/lib/view-cache";

export function useViewCounter(slug: string, initialCount: number = 0) {
  const cachedCount = getCachedViewCount(slug);
  const bestInitialCount =
    cachedCount !== null && cachedCount >= initialCount
      ? cachedCount
      : initialCount;

  const [viewCount, setViewCount] = useState<number>(bestInitialCount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const handleViewIncrement = async () => {
      try {
        const shouldIncrement = checkShouldIncrement(slug);

        if (shouldIncrement) {
          const response = await fetch("/api/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug }),
          });

          const data = await response.json();
          if (data.success) {
            setViewCount(data.view_count);
            setCachedViewCount(slug, data.view_count);
            recordView(slug);
          }
        } else {
          setCachedViewCount(slug, viewCount);
        }
      } catch (error) {
        console.error("Error updating view count:", error);
      } finally {
        setIsLoading(false);
      }
    };
    setViewCount(bestInitialCount);
    handleViewIncrement();
  }, [slug, bestInitialCount, viewCount]);

  return { viewCount, isLoading };
}

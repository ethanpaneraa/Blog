"use client";

import { useState, useCallback } from "react";
import { CommentList } from "@/components/comments/comments-list";
import { CommentForm } from "@/components/comments/comments-form";

interface CommentsSectionProps {
  slug: string;
}

export function CommentsSection({ slug }: CommentsSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <section className="mt-16 pt-8 border-t border-gray-06">
      <div key={refreshKey}>
        <CommentList slug={slug} />
      </div>
      <div className="mt-8">
        <CommentForm slug={slug} onCommentAdded={handleCommentAdded} />
      </div>
    </section>
  );
}

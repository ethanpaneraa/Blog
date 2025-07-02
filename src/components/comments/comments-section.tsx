"use client";

import { useState, useCallback } from "react";
import { CommentList } from "@/components/comments/comments-list";
import { CommentForm } from "@/components/comments/comments-form";
import { Comment } from "@/lib/supabase/types";

interface CommentsSectionProps {
  slug: string;
  initialComments?: Comment[];
}

export function CommentsSection({
  slug,
  initialComments = [],
}: CommentsSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <section className="mt-16 pt-8 border-t border-gray-06">
      <div key={refreshKey}>
        <CommentList slug={slug} initialComments={initialComments} />
      </div>
      <div className="mt-8">
        <CommentForm slug={slug} onCommentAdded={handleCommentAdded} />
      </div>
    </section>
  );
}

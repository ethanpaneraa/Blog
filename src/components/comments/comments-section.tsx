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
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleCommentAdded = useCallback((newComment?: Comment) => {
    if (newComment) {
      setComments((prevComments) => [newComment, ...prevComments]);
    } else {
      fetchComments();
    }
  }, []);

  const handleReplyAdded = useCallback(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?slug=${slug}`);
      const data = await response.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <section className="mt-16 pt-8 border-t border-gray-06">
      <CommentList
        slug={slug}
        comments={comments}
        onReplyAdded={handleReplyAdded}
      />
      <div className="mt-8">
        <CommentForm slug={slug} onCommentAdded={handleCommentAdded} />
      </div>
    </section>
  );
}

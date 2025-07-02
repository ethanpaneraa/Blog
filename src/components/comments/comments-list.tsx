"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/lib/supabase/types";

interface CommentListProps {
  slug: string;
}

export function CommentList({ slug }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?slug=${slug}`);
      const data = await response.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading comments...</div>;
  }

  if (comments.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-12">
        Comments ({comments.length})
      </h3>
      {comments.map((comment) => (
        <div key={comment.id} className="border-l-2 border-gray-06 pl-4 py-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-12">
              {comment.author_name}
            </span>
            <span className="text-gray-09 text-sm">
              {new Date(comment.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-gray-11 whitespace-pre-wrap">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}

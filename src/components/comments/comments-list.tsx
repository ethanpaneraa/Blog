"use client";

import { useEffect, useState } from "react";
import { Comment } from "@/lib/supabase/types";
import { CommentForm } from "@/components/comments/comments-form";

interface CommentListProps {
  slug: string;
  initialComments?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  slug: string;
  onReplyAdded: () => void;
  depth?: number;
}

function CommentItem({
  comment,
  slug,
  onReplyAdded,
  depth = 0,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const maxDepth = 3;

  const handleReplyAdded = () => {
    setShowReplyForm(false);
    onReplyAdded();
  };

  return (
    <div
      className={`${depth > 0 ? "ml-6 border-l-2 border-gray-06 pl-4" : ""}`}
    >
      <div className="py-2">
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
          {depth < maxDepth && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-09 text-sm hover:text-gray-11 transition-colors underline"
            >
              {showReplyForm ? "cancel" : "reply"}
            </button>
          )}
        </div>
        <p className="text-gray-11 whitespace-pre-wrap mb-4">
          {comment.content}
        </p>

        {showReplyForm && (
          <div className="mb-4">
            <CommentForm
              slug={slug}
              parentId={comment.id}
              onCommentAdded={handleReplyAdded}
              isReply={true}
            />
          </div>
        )}
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              slug={slug}
              onReplyAdded={onReplyAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({ slug, initialComments = [] }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [loading, setLoading] = useState(!initialComments.length);

  useEffect(() => {
    // Only fetch if we don't have initial comments
    if (!initialComments.length) {
      fetchComments();
    }
  }, [slug, initialComments.length]);

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

  const getTotalCommentCount = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return (
        total +
        1 +
        (comment.replies ? getTotalCommentCount(comment.replies) : 0)
      );
    }, 0);
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading comments...</div>;
  }

  const totalComments = getTotalCommentCount(comments);

  if (totalComments === 0) {
    return (
      <div className="text-gray-400 text-sm">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-12">
        Comments ({totalComments})
      </h3>
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            slug={slug}
            onReplyAdded={fetchComments}
          />
        ))}
      </div>
    </div>
  );
}

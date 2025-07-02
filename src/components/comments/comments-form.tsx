"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Comment } from "@/lib/supabase/types";

interface CommentFormProps {
  slug: string;
  parentId?: string;
  onCommentAdded?: () => void;
  isReply?: boolean;
  replyingTo?: Comment;
}

interface SavedUserInfo {
  name: string;
  email: string;
  timestamp: number;
}

const STORAGE_KEY = "blog_comment_user_info";
const STORAGE_EXPIRY = 30 * 24 * 60 * 60 * 1000;

export function CommentForm({
  slug,
  parentId,
  onCommentAdded,
  isReply = false,
  replyingTo,
}: CommentFormProps) {
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    content: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [showClearOption, setShowClearOption] = useState(false);
  const [hasSavedInfo, setHasSavedInfo] = useState(false);

  useEffect(() => {
    loadSavedUserInfo();
  }, []);

  const loadSavedUserInfo = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const userInfo: SavedUserInfo = JSON.parse(saved);
        const now = Date.now();
        if (now - userInfo.timestamp < STORAGE_EXPIRY) {
          setFormData((prev) => ({
            ...prev,
            author_name: userInfo.name,
            author_email: userInfo.email,
          }));
          // Set that we have saved info, but don't show the banner yet
          setHasSavedInfo(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.warn("Failed to load saved user info:", error);
    }
  };

  const saveUserInfo = (name: string, email: string) => {
    try {
      const userInfo: SavedUserInfo = {
        name,
        email,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
      setHasSavedInfo(true);
    } catch (error) {
      console.warn("Failed to save user info:", error);
    }
  };

  const clearSavedInfo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setFormData((prev) => ({
        ...prev,
        author_name: "",
        author_email: "",
      }));
      setShowClearOption(false);
      setHasSavedInfo(false);
    } catch (error) {
      console.warn("Failed to clear saved info:", error);
    }
  };

  // Show the banner when user focuses on the name field (if they have saved info)
  const handleNameFieldFocus = () => {
    if (hasSavedInfo && formData.author_name) {
      setShowClearOption(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          parent_id: parentId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setStatus("error");
          setMessage(data.error);
          return;
        }
        if (response.status === 409) {
          setStatus("error");
          setMessage(data.error);
          return;
        }
        throw new Error(data.error);
      }

      saveUserInfo(formData.author_name, formData.author_email);

      setStatus("success");
      setMessage(
        isReply ? "Reply posted successfully!" : "Comment posted successfully!"
      );

      setFormData((prev) => ({
        ...prev,
        content: "",
      }));

      if (onCommentAdded) {
        setTimeout(onCommentAdded, 500);
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const formTitle = isReply ? "reply to comment" : "share your thoughts";
  const buttonText = isReply ? "share reply" : "share comment";

  return (
    <div className={isReply ? "" : "border-t border-gray-06 pt-8"}>
      {!isReply && (
        <h3 className="text-lg font-semibold text-gray-12 mb-4">{formTitle}</h3>
      )}
      {isReply && replyingTo && (
        <div className="mb-4 p-3 bg-gray-02 border border-gray-04 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-09 text-sm">Replying to</span>
            <span className="font-medium text-gray-11">
              {replyingTo.author_name}:
            </span>
          </div>
          <p className="text-gray-10 text-sm italic">
            "
            {replyingTo.content.length > 150
              ? replyingTo.content.substring(0, 150) + "..."
              : replyingTo.content}
            "
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={`grid ${isReply ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}
        >
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="a name or pseudonym"
              value={formData.author_name}
              onChange={(e) =>
                setFormData({ ...formData, author_name: e.target.value })
              }
              onFocus={handleNameFieldFocus}
              required
              className="bg-transparent border border-gray-06 text-gray-12 placeholder:text-gray-10"
              disabled={status === "loading"}
            />
            <p className="text-xs text-gray-09">
              Your name will be displayed with your comment. You can also use a
              pseudonym.
            </p>
          </div>
          {!isReply && (
            <Input
              type="email"
              placeholder="your email (not shown publicly)"
              value={formData.author_email}
              onChange={(e) =>
                setFormData({ ...formData, author_email: e.target.value })
              }
              required
              className="bg-transparent border border-gray-06 text-gray-12 placeholder:text-gray-10"
              disabled={status === "loading"}
            />
          )}
          {isReply && (
            <Input
              type="email"
              placeholder="Your email (not shown publicly)"
              value={formData.author_email}
              onChange={(e) =>
                setFormData({ ...formData, author_email: e.target.value })
              }
              required
              className="bg-transparent border border-gray-06 text-gray-12 placeholder:text-gray-10"
              disabled={status === "loading"}
            />
          )}
        </div>
        <textarea
          placeholder={
            isReply && replyingTo
              ? `Reply to ${replyingTo.author_name}...`
              : isReply
                ? "rely to this comment..."
                : "what are your thoughts..."
          }
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          required
          rows={isReply ? 3 : 4}
          maxLength={1000}
          className="w-full bg-transparent border border-gray-06 text-gray-12 placeholder:text-gray-10 p-3 rounded-md focus:border-gray-8 focus:ring-0 resize-none"
          disabled={status === "loading"}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-09">
            {formData.content.length}/1000 characters
          </span>
          <Button
            type="submit"
            disabled={status === "loading"}
            className="bg-gray-A03 text-gray-1 hover:bg-gray-A02"
          >
            {status === "loading" ? "Posting..." : buttonText}
          </Button>
        </div>

        {message && (
          <p
            className={`text-sm ${status === "error" ? "text-red-500" : "text-green-500"}`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

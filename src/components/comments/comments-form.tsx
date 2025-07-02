"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommentFormProps {
  slug: string;
  onCommentAdded?: () => void;
}

export function CommentForm({ slug, onCommentAdded }: CommentFormProps) {
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    content: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...formData }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setStatus("success");
      setMessage("Comment posted successfully!");
      setFormData({ author_name: "", author_email: "", content: "" });

      // Trigger parent component to refresh comments
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

  return (
    <div className="border-t border-gray-06 pt-8">
      <h3 className="text-lg font-semibold text-gray-12 mb-4">
        Leave a Comment
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Your name"
            value={formData.author_name}
            onChange={(e) =>
              setFormData({ ...formData, author_name: e.target.value })
            }
            required
            className="bg-transparent border border-gray-06 text-gray-12 placeholder:text-gray-10"
            disabled={status === "loading"}
          />
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
        </div>

        <textarea
          placeholder="Your comment..."
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          required
          rows={4}
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
            {status === "loading" ? "Posting..." : "Post Comment"}
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

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";
import { commentRateLimiter } from "@/lib/rate-limit";
import { Comment } from "@/lib/supabase/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  comments.forEach((comment) => {
    comment.replies = [];
    commentMap.set(comment.id, comment);
  });

  comments.forEach((comment) => {
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies!.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .select("*")
      .eq("post_slug", slug)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const comments = data || [];
    const threadedComments = buildCommentTree(comments);

    return NextResponse.json({ comments: threadedComments });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "Failed to get comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { slug, author_name, author_email, content, parent_id } =
      await request.json();

    if (!slug || !author_name || !author_email || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";

    const ipIdentifier = `ip:${ip}`;
    const emailIdentifier = `email:${author_email}`;

    if (
      commentRateLimiter.isRateLimited(ipIdentifier) ||
      commentRateLimiter.isRateLimited(emailIdentifier)
    ) {
      const remainingTime = Math.max(
        commentRateLimiter.getRemainingTime(ipIdentifier),
        commentRateLimiter.getRemainingTime(emailIdentifier)
      );

      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please wait ${Math.ceil(remainingTime / (1000 * 60))} minutes before commenting again.`,
        },
        { status: 429 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(author_email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Comment too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    if (parent_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from(TABLES.COMMENTS)
        .select("id")
        .eq("id", parent_id)
        .eq("post_slug", slug)
        .single();

      if (parentError || !parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .insert([
        {
          post_slug: slug,
          author_name: author_name.trim(),
          author_email: author_email.trim(),
          content: content.trim(),
          parent_id: parent_id || null,
          is_approved: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      comment: data,
    });
  } catch (error) {
    console.error("Post comment error:", error);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}

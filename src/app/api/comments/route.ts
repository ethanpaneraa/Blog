// app/api/comments/route.ts (with global name uniqueness validation)
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";
import { commentRateLimiter } from "@/lib/rate-limit";
import { Comment } from "@/lib/supabase/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to build comment tree
function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create map and initialize replies array
  comments.forEach((comment) => {
    comment.replies = [];
    commentMap.set(comment.id, comment);
  });

  // Second pass: build tree structure
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

    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "unknown";

    // Check rate limit by IP and email
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(author_email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Basic content length validation
    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Comment too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    // Name length validation
    if (author_name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    if (author_name.trim().length > 50) {
      return NextResponse.json(
        { error: "Name must be less than 50 characters" },
        { status: 400 }
      );
    }

    // GLOBAL name uniqueness check across ALL posts
    const { data: existingCommentsWithName, error: nameCheckError } =
      await supabase
        .from(TABLES.COMMENTS)
        .select("author_name, author_email, post_slug")
        .eq("is_approved", true)
        .ilike("author_name", author_name.trim());

    if (nameCheckError) {
      console.error("Name check error:", nameCheckError);
      // Don't fail the request if we can't check names, just log it
    } else if (
      existingCommentsWithName &&
      existingCommentsWithName.length > 0
    ) {
      // Check if it's the same person (same email) trying to comment again
      const samePersonComment = existingCommentsWithName.find(
        (comment) =>
          comment.author_email.toLowerCase() === author_email.toLowerCase()
      );

      if (!samePersonComment) {
        // Someone else is already using this name globally
        const firstUsagePost = existingCommentsWithName[0].post_slug;
        return NextResponse.json(
          {
            error: `The name "${author_name.trim()}" is already registered by another user across the blog. Please choose a different name to maintain unique identities.`,
          },
          { status: 409 }
        );
      }
      // If it's the same email, allow them to continue using their established name
    }

    // If this is a reply, verify parent comment exists
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
          author_email: author_email.trim().toLowerCase(),
          content: content.trim(),
          parent_id: parent_id || null,
          is_approved: true, // Auto-approve for now
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

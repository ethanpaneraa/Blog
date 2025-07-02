import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";
import { commentRateLimiter } from "@/lib/rate-limit";
import { Comment } from "@/lib/supabase/types";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

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

async function sendCommentNotification(
  comment: Comment,
  postSlug: string,
  isReply: boolean = false
) {
  try {
    if (
      !process.env.RESEND_API_KEY ||
      !process.env.EMAIL_FROM ||
      !process.env.ADMIN_EMAIL
    ) {
      console.log("Email notification skipped - missing environment variables");
      return;
    }

    const postUrl = `${process.env.NEXT_PUBLIC_APP_URL}/writing/${postSlug}`;
    const commentType = isReply ? "reply" : "comment";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Geist Mono', monospace; background-color: #111110; color: #b5b3ad; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #191918; border: 1px solid #3b3a37; padding: 30px; }
            .header { font-size: 20px; margin-bottom: 20px; color: #eeeeec; }
            .comment-box { background: #222221; border-left: 3px solid #b5b3ad; padding: 15px; margin: 20px 0; }
            .meta { color: #6f6d66; font-size: 14px; margin-bottom: 10px; }
            .content { color: #b5b3ad; line-height: 1.6; white-space: pre-wrap; }
            .actions { margin-top: 30px; }
            .button { background: #b5b3ad; color: #111110; padding: 10px 20px; text-decoration: none; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              new ${commentType} on ethanpinedaa.blog
            </div>

            <div class="meta">
              <strong>Post:</strong> ${postSlug}<br>
              <strong>Author:</strong> ${comment.author_name}<br>
              <strong>Time:</strong> ${new Date(comment.created_at).toLocaleString()}
            </div>

            <div class="comment-box">
              <div class="content">${comment.content}</div>
            </div>

            <div class="actions">
              <a href="${postUrl}" class="button">View ${commentType}</a>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `💬 New ${commentType} on "${postSlug}"`,
      html: emailHtml,
    });

    console.log(`Email notification sent for ${commentType} on ${postSlug}`);
  } catch (error) {
    console.error("Failed to send comment notification email:", error);
  }
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

    const { data: existingCommentsWithName, error: nameCheckError } =
      await supabase
        .from(TABLES.COMMENTS)
        .select("author_name, author_email, post_slug")
        .eq("is_approved", true)
        .ilike("author_name", author_name.trim());

    if (nameCheckError) {
      console.error("Name check error:", nameCheckError);
    } else if (
      existingCommentsWithName &&
      existingCommentsWithName.length > 0
    ) {
      const samePersonComment = existingCommentsWithName.find(
        (comment) =>
          comment.author_email.toLowerCase() === author_email.toLowerCase()
      );

      if (!samePersonComment) {
        return NextResponse.json(
          {
            error: `The name "${author_name.trim()}" is already registered by another user across the blog. Please choose a different name to maintain unique identities.`,
          },
          { status: 409 }
        );
      }
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
          author_email: author_email.trim().toLowerCase(),
          content: content.trim(),
          parent_id: parent_id || null,
          is_approved: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    sendCommentNotification(data, slug, !!parent_id).catch((error) => {
      console.error("Email notification failed:", error);
    });

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

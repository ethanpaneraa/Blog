import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    return NextResponse.json({ comments: data || [] });
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
    const { slug, author_name, author_email, content } = await request.json();

    if (!slug || !author_name || !author_email || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
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

    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .insert([
        {
          post_slug: slug,
          author_name: author_name.trim(),
          author_email: author_email.trim(),
          content: content.trim(),
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

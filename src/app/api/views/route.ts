import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    const { data: existingCount, error: selectError } = await supabase
      .from(TABLES.VIEW_COUNTS)
      .select("view_count")
      .eq("post_slug", slug)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    if (existingCount) {
      const { data, error } = await supabase
        .from(TABLES.VIEW_COUNTS)
        .update({
          view_count: existingCount.view_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("post_slug", slug)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        view_count: data.view_count,
      });
    } else {
      const { data, error } = await supabase
        .from(TABLES.VIEW_COUNTS)
        .insert([{ post_slug: slug, view_count: 1 }])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        view_count: data.view_count,
      });
    }
  } catch (error) {
    console.error("View count error:", error);
    return NextResponse.json(
      { error: "Failed to update view count" },
      { status: 500 }
    );
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
      .from(TABLES.VIEW_COUNTS)
      .select("view_count")
      .eq("post_slug", slug)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({
      view_count: data?.view_count || 0,
    });
  } catch (error) {
    console.error("Get view count error:", error);
    return NextResponse.json(
      { error: "Failed to get view count" },
      { status: 500 }
    );
  }
}

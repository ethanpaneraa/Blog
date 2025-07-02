import { createClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getViewCount(slug: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from(TABLES.VIEW_COUNTS)
      .select("view_count")
      .eq("post_slug", slug)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching view count:", error);
      return 0;
    }

    return data?.view_count || 0;
  } catch (error) {
    console.error("Error fetching view count:", error);
    return 0;
  }
}

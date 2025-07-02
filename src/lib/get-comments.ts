import { createClient } from "@supabase/supabase-js";
import { TABLES } from "@/lib/constants";
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

export async function getComments(slug: string): Promise<Comment[]> {
  try {
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .select("*")
      .eq("post_slug", slug)
      .eq("is_approved", true)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const comments = data || [];
    return buildCommentTree(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

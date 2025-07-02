import { Posts } from "@/components/posts";
import { type MDXFileData } from "@/lib/blog";

export function PostsList({
  posts,
  viewCounts,
}: {
  posts: MDXFileData[];
  viewCounts: Record<string, number>;
}) {
  return <Posts posts={posts} viewCounts={viewCounts} />;
}

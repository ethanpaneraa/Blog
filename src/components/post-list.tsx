import { Posts } from "@/components/posts";
import { type MDXFileData } from "@/lib/blog";

export function PostsList({ posts }: { posts: MDXFileData[] }) {
  return <Posts posts={posts} />;
}
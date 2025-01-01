import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPosts } from "@/lib/blog";

const posts = getPosts()
  .sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  )
  .slice(0, 4);

export function WritingSection() {
  return (
    <section className="mb-12 w-full animate-fade-in-up">
      <h2 className="mb-4 flex items-center font-semibold text-gray-12 text-lg">
        writing
      </h2>
      <div className="space-y-3">
        {posts.map((post, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center group gap-1 sm:gap-4"
          >
            <Link
              href={`/writing/${post.slug}`}
              className="text-gray-200 hover:text-accent transition-colors duration-200 text-base truncate"
            >
              {post.metadata.title.toLowerCase()}
            </Link>
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {formatDate(post.metadata.date)}
            </span>
          </div>
        ))}
      </div>
      <Link
        href="/writing"
        className="inline-flex items-center gap-1 mt-5 text-accent hover:underline group text-sm"
      >
        all posts{" "}
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </section>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toLowerCase();
}

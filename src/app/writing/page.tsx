import { PostsList } from "@/components/post-list";
import { getPosts } from "@/lib/blog";
import { Metadata } from "next";
import MainNav from "@/components/navigation-bar";

const posts = getPosts().sort(
  (a, b) =>
    new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
);

console.log("this is the posts", posts);

export default async function WritingPage() {
  return (
    <main className="animate-fade-in-up relative max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
      <MainNav backable={true} backMessage="Home" backAnchor="/" />
      <h1 className="text-4xl font-bold mb-8 text-white">writing</h1>

      <p className="hidden sm:block text-sm text-gray-400 mb-8">
        press{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          /
        </kbd>{" "}
        to search • use{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          ctrl / ⌘ j
        </kbd>{" "}
        and{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          ctrl / ⌘ k
        </kbd>{" "}
        or{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          ↑
        </kbd>{" "}
        and{" "}
        <kbd className="px-1 py-0.5 text-xs border border-gray-700 rounded">
          ↓
        </kbd>{" "}
        to navigate
      </p>

      <PostsList posts={posts} />
    </main>
  );
}

export const metadata: Metadata = {
  title: "Blog",
  description: "Writings on programming, computer science, and more.",
  openGraph: {
    images: [
      {
        url: "https://www.nexxel.dev/og/home?title=blog",
      },
    ],
  },
};

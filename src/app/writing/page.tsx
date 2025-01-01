import { PostsList } from "@/components/post-list";
import { getPosts } from "@/lib/blog";
import { Metadata } from "next";
import MainNav from "@/components/navigation-bar";

const posts = getPosts().sort(
  (a, b) =>
    new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
);

export default async function WritingPage() {
  return (
    <>
      <div className="motion-safe:animate-fade">
        <MainNav backable={true} backMessage="home" backAnchor="/" />
        <main className="animate-fade-in-up min-h-screen relative max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
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
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "writing",
  description:
    "writing pieces on software engineering, life, career development, and my personal interest and goals.",
  openGraph: {
    images: [
      {
        url: "https://blog-chi-neon-82.vercel.app/og/home?title=writing",
      },
    ],
  },
};

import { notFound } from "next/navigation";
import { MDX } from "./mdx";
import { getPostBySlug, getPosts } from "@/lib/blog";
import { getViewCount } from "@/lib/get-view-count";
import { getComments } from "@/lib/get-comments";
import MainNav from "@/components/navigation-bar";
import { ViewCounter } from "@/components/view-counter";
import { CommentsSection } from "@/components/comments/comments-section";
import { formatDate } from "@/lib/format-date";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);
  if (!post) {
    return;
  }

  const publishedTime = formatDate(post.metadata.date);

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      publishedTime,
      type: "article",
      url: `https://blog-chi-neon-82.vercel.app/writing/${post.slug}`,
      images: [
        {
          url: `https://blog-chi-neon-82.vercel.app/og/writing?title=${post.metadata.title}`,
        },
      ],
    },
    twitter: {
      title: post.metadata.title,
      description: post.metadata.description,
      card: "summary_large_image",
      creator: "@ethanpaneraa",
      images: [
        `https://blog-chi-neon-82.vercel.app/og/writing?title=${post.metadata.title}&top=${publishedTime}`,
      ],
    },
  };
}

export default async function Post({ params }: PageProps) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [initialViewCount, initialComments] = await Promise.all([
    getViewCount(slug),
    getComments(slug),
  ]);

  return (
    <>
      <div className="motion-safe:animate-fade">
        <MainNav backable={true} backMessage="writing" backAnchor="/writing" />
        <section className="animate-fade-in-up max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.metadata.title,
                datePublished: post.metadata.date,
                dateModified: post.metadata.date,
                description: post.metadata.description,
                image: `https://blog-chi-neon-82.vercel.app/og/writing?title=${
                  post.metadata.title
                }&top=${formatDate(post.metadata.date)}`,
                url: `https://blog-chi-neon-82.vercel.app/writing/${post.slug}`,
                author: {
                  "@type": "Person",
                  name: "ethan pineda",
                },
              }),
            }}
          />
          <h1 className="text-4xl font-bold mb-4 text-white">
            {post.metadata.title}
          </h1>
          <div className="mb-8 flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span>{formatDate(post.metadata.date)}</span>
              <ViewCounter slug={slug} initialCount={initialViewCount} />
            </div>
          </div>
          <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-white hover:prose-a:underline">
            <MDX source={post.content} />
          </article>
          <CommentsSection slug={slug} initialComments={initialComments} />
        </section>
      </div>
    </>
  );
}

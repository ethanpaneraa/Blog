import { notFound } from "next/navigation";
import { MDX } from "./mdx";
import { getPostBySlug } from "@/lib/blog";
import MainNav from "@/components/navigation-bar";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
      url: `https://www.nexxel.dev/writing/${post.slug}`,
      images: [
        {
          url: `https://www.nexxel.dev/og/blog?title=${post.metadata.title}`,
        },
      ],
    },
    twitter: {
      title: post.metadata.title,
      description: post.metadata.description,
      card: "summary_large_image",
      creator: "@nexxeln",
      images: [
        `https://www.nexxel.dev/og/blog?title=${post.metadata.title}&top=${publishedTime}`,
      ],
    },
  };
}

export default async function Post({ params }: PageProps) {
  const slug = (await params).slug;
  const post = getPostBySlug(slug);

  console.log("this is the slug", slug);
  console.log("this is the post", post);

  if (!post) {
    notFound();
  }

  return (
    <>
      <MainNav backable={true} backMessage="Writing" backAnchor="/writing" />
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
              image: `https://nexxel.dev/og/blog?title=${
                post.metadata.title
              }&top=${formatDate(post.metadata.date)}`,
              url: `https://nexxel.dev/blog/${post.slug}`,
              author: {
                "@type": "Person",
                name: "Shoubhit Dash",
              },
            }),
          }}
        />

        <h1 className="text-4xl font-bold mb-4 text-white">
          {post.metadata.title}
        </h1>

        <div className="mb-8 flex items-center justify-between text-sm text-gray-400">
          <span>{formatDate(post.metadata.date)}</span>
        </div>

        <article className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-white hover:prose-a:underline">
          <MDX source={post.content} />
        </article>
      </section>
    </>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
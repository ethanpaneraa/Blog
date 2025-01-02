import Link from "next/link";

export default function SubscriptionConfirmed() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto p-8 min-h-screen motion-safe:animate-fade">
      <h1 className="text-3xl font-bold mb-4">Subscription Confirmed!</h1>
      <p className="text-gray-600 mb-8">
        thank you for subscribing to my newsletter! you&apos;ll recieve updates
        whenever i post new content on my blog. 💌
      </p>
      <Link href="/">go back to the homepage</Link>
    </div>
  );
}

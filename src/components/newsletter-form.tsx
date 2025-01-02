"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Blur } from "@/components/ui/blur";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setStatus("success");
      setMessage(
        "Please check your email to confirm your subscription! It may take a few minutes to reach you"
      );
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <section className="w-full">
      <h2 className="mb-4 flex items-center font-semibold text-gray-12 text-lg">
        newsletter
      </h2>
      <Blur>
        <p className="text-gray-11 text-sm">
          if you want to stay up to date with my writing (yapping), subscribe to
          my newsletter! i promise that i&apos;ll have good and hot takes
        </p>
      </Blur>
      <form onSubmit={subscribe} className="space-y-4 max-w-md py-12">
        <div className="flex flex-col space-y-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border border-gray-06 text-gray-12 placeholder:text-gray-10 focus:border-gray-8 focus:ring-0"
            disabled={status === "loading"}
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gray-A03 text-gray-1 hover:bg-gray-A02 transition-colors duration-200"
          >
            {status === "loading" ? "subscribing..." : "subscribe"}
          </Button>
        </div>
        {message && (
          <Blur>
            <p
              className={`text-sm mt-4 ${
                status === "error" ? "text-red-500" : "text-gray-11"
              }`}
            >
              {message}
            </p>
          </Blur>
        )}
      </form>
    </section>
  );
}

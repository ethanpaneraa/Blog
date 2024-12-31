"use client";

import { ArrowUpRight } from "lucide-react";
import { Blur } from "@/components/ui/blur";

export default function Header() {
  return (
    <header className="flex flex-col gap-6 text-gray-12">
      <div className="space-y-2">
        <h1 className="text-2xl font-normal text-gray-11">
          <span className="text-base text-gray-11">ethan pineda</span>
        </h1>
        <div className="space-y-1">
          <p className="text-lg ">making things on the web.</p>
          <p className="text-lg ">
            exploring low-level systems, life, and career growth.
          </p>
        </div>
      </div>

      <p className="text-gray-11 text-base">
        Get in touch via{" "}
        <a
          href="https://twitter.com"
          className="inline-flex items-center hover:underline"
        >
          Twitter <ArrowUpRight className="ml-0.5 h-3 w-3" />
        </a>{" "}
        or{" "}
        <a
          href="mailto:example@email.com"
          className="inline-flex items-center hover:underline"
        >
          email <ArrowUpRight className="ml-0.5 h-3 w-3" />
        </a>
        , see my code on{" "}
        <a
          href="https://github.com"
          className="inline-flex items-center hover:underline"
        >
          Github <ArrowUpRight className="ml-0.5 h-3 w-3" />
        </a>
        , or find me on{" "}
        <Blur>
          <a>platforms that i don't like using</a>
        </Blur>
        .
      </p>
    </header>
  );
}

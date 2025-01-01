"use client";

type MainNavProps =
  | {
      backable?: boolean;
      backMessage?: never;
      backAnchor?: string;
    }
  | {
      backable: true;
      backMessage?: string;
      backAnchor?: string;
    };

const MainNav: React.FC<MainNavProps> = ({
  backable,
  backMessage,
  backAnchor,
}) => {
  const [anchor, setAnchor] = useState("/");
  const [destination, setDestination] = useState<string>(backMessage || "Back");

  useEffect(() => {
    if (backAnchor) {
      setAnchor(backAnchor);
      // Only set destination if backMessage isn't provided
      if (!backMessage) {
        // Convert path to readable text
        const readablePath =
          backAnchor
            .split("/")
            .filter(Boolean) // Remove empty strings
            .pop() // Get last segment
            ?.replace(/-/g, " ") // Replace hyphens with spaces
            ?.replace(/^\w/, (c) => c.toUpperCase()) || "Back"; // Capitalize first letter
        setDestination(readablePath);
      }
    }
  }, [backAnchor, backMessage]);

  return (
    <nav
      className={cva(
        "relative z-aboveVignette flex w-full items-start justify-end p-8 md:mx-auto md:px-16",
        {
          variants: {
            backable: {
              backable: "justify-between",
            },
          },
        }
      )({
        backable: backable ? "backable" : undefined,
      })}
    >
      {backable && (
        <Link
          href={anchor ? anchor : "/"}
          className="group -mx-4 flex translate-x-0 transform cursor-pointer select-none items-center gap-1 px-4 pb-0 text-xl text-gray-11 duration-moderate-01 ease-productive-standard hover:-translate-x-2 hover:text-gray-12 focus:-translate-x-2 focus:text-gray-12 motion-safe:transition-all"
        >
          <span className="flex-shrink-0 translate-y-[1px]">
            {anchor === "/" ? <PinLeftIcon /> : <ArrowLeftIcon />}
          </span>
          <span className="ml-1 opacity-[0.01] duration-fast-02 ease-productive-standard group-hover:opacity-100 group-focus:opacity-100 motion-safe:transition-opacity">
            {destination}
          </span>
        </Link>
      )}
    </nav>
  );
};

export default MainNav;
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, PinLeftIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";

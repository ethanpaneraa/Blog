"use client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <PortalStoreProvider> */}
      <HistoryTracker />
      {children}
      {/* </PortalStoreProvider> */}
    </>
  );
};

import { create } from "zustand";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
// import { PortalStoreProvider } from "@/components/ui/Portal";

type BreadcrumbsState = {
  breadcrumbs: string[];
  add: (path: string) => void;
  getPreviousPath: (currentPath: string) => string;
};

export const useBreadcrumbsStore = create<BreadcrumbsState>((set, get) => ({
  breadcrumbs: [],
  add: (path) =>
    set((state) => ({ breadcrumbs: [...state.breadcrumbs, path] })),
  getPreviousPath: (currentPath) => {
    const { breadcrumbs } = get();
    const currentIndex = breadcrumbs.lastIndexOf(currentPath);
    // If we can't find the current path or it's the first item, return root
    if (currentIndex <= 0) return "/";
    // Otherwise return the previous path
    return breadcrumbs[currentIndex - 1];
  },
}));

const HistoryTracker = () => {
  const pathname = usePathname();
  // Instead of just the last segment, let's track the full path
  const { add } = useBreadcrumbsStore();

  useEffect(() => {
    // Add the full path instead of just the segment
    add(pathname || "/");
  }, [pathname, add]);

  return <></>;
};

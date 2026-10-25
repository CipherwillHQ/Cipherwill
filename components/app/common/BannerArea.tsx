// Stacks inline account notices in a reusable banner area.
// Owns consistent width and spacing, collapsing when no banners are present.
// Does not choose banners or handle their actions.
import { Children } from "react";
import type { BannerAreaProps } from "@/types/interfaces";

export default function BannerArea({ children }: BannerAreaProps) {
  const banners = Children.toArray(children);
  if (!banners.length) return null;
  return <aside aria-label="Account notices" className="flex w-full max-w-2xl flex-col gap-3 text-left">
    {banners}
  </aside>;
}

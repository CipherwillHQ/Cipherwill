"use client";

import { IS_PRODUCTION } from "@/common/constant";

export default function ShareMetapod() {
  if (IS_PRODUCTION) return null;
  return (
    <button className="border text-xs rounded-full px-4 py-1">
      Share
    </button>
  );
}

// Renders the "How this works?" capsule button in the guide overview corner.
// Owns popup visibility state and triggers the shared CIPHERWILL_EXPLAINER video modal.
// Does not manage guidance objectives or account overview metrics.
"use client";

import { useState } from "react";
import { TbPlayerPlayFilled } from "react-icons/tb";
import { CIPHERWILL_EXPLAINER } from "@/common/constant";
import VideoPopup from "@/components/public/VideoPopup";

export default function HowThisWorksButton() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsVideoOpen(true)}
        className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 text-xs font-medium text-black/80 shadow-xs transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current active:scale-[0.98] dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 dark:hover:text-white"
      >
        <TbPlayerPlayFilled className="h-3.5 w-3.5 shrink-0 text-primary dark:text-primary-400" />
        <span>How this works?</span>
      </button>

      <VideoPopup
        open={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={CIPHERWILL_EXPLAINER}
        title="How Cipherwill Works"
      />
    </>
  );
}

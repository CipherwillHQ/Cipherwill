// Presents the Do later count as a pill beside account-status links.
// Owns local popup visibility for the deferred objective list.
// Does not show answers or enable segments.
import { useState } from "react";
import type { DeferredGuidanceProps } from "@/types/interfaces";
import DeferredGuidancePopup from "./DeferredGuidancePopup";
import { OVERVIEW_PILL_CLASS } from "./overviewPillClass";

export default function DeferredGuidance({ deferred, onResume, loading }: DeferredGuidanceProps & { loading: boolean }) {
  const [open, setOpen] = useState(false);
  if (!deferred.length) return null;
  return <>
    <button type="button" className={OVERVIEW_PILL_CLASS} aria-label={`Do later (${deferred.length})`}
      aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
      <span className="text-black/60 dark:text-white/60">Do later</span>
      <span className="font-medium tabular-nums">{deferred.length.toLocaleString()}</span>
    </button>
    <DeferredGuidancePopup open={open} onClose={() => setOpen(false)} deferred={deferred} onResume={onResume} loading={loading} />
  </>;
}

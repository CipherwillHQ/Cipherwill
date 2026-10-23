// Advances successful completion displays using browser timers.
// Owns countdown-triggered continuation and timer cancellation.
// Does not retry failed saves or migrations automatically.
import { useEffect } from "react";
import type { ObjectiveInProgress } from "@/types/interfaces";

export default function useGuidedTimedDisplay(open: boolean, current: ObjectiveInProgress | null, error: string | null, onContinue: () => Promise<void>) {
  useEffect(() => {
    const delay = current?.result.displayForMs ?? 0;
    if (!open || error || !current || current.result.input || delay <= 0) return;
    const timer = window.setTimeout(() => { void onContinue(); }, delay);
    return () => window.clearTimeout(timer);
  }, [open, current, error, onContinue]);
}

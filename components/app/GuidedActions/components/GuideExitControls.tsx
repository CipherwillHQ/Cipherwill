// Provides the whole-guide pause control beneath objective content.
// Owns the subtle return-to-overview button and its busy state.
// Does not persist choices or reset draft answers.
import type { GuidancePanelProps } from "@/types/interfaces";

const BUTTON_CLASS = "cursor-pointer rounded-lg border border-black/10 px-3 py-2 text-sm text-black/60 hover:text-black disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white/60 dark:hover:text-white";

export default function GuideExitControls({ loading, onClose }: Pick<GuidancePanelProps, "loading" | "onClose">) {
  return <div className="flex flex-col items-center gap-3">
    <button type="button" onClick={onClose} disabled={loading} className={BUTTON_CLASS}>Let's do this later</button>
  </div>;
}

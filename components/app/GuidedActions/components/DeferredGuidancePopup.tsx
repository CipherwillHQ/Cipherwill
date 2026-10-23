// Displays deferred objectives in a modal with a bounded scrollable list.
// Owns the heading, close/resume controls, and portal privacy markers.
// Does not fetch objectives, change deferrals, or show draft answers.
import Popup from "reactjs-popup";
import type { DeferredGuidancePopupProps } from "@/types/interfaces";

export default function DeferredGuidancePopup({ open, onClose, deferred, onResume, loading }: DeferredGuidancePopupProps) {
  return <Popup open={open} onClose={onClose} modal lockScroll closeOnEscape closeOnDocumentClick
    contentStyle={{ width: "min(32rem, calc(100vw - 2rem))", padding: 0, border: 0, background: "transparent" }}>
    <section aria-label="Do later" className="cw-private-guidance ph-no-capture sentry-block flex max-h-[80dvh] flex-col rounded-xl border border-black/10 bg-dashboardCream p-5 text-left text-black shadow-xl dark:border-white/10 dark:bg-darkCanvas dark:text-white">
      <div className="flex shrink-0 items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Do later ({deferred.length})</h2>
        <button type="button" onClick={onClose} aria-label="Close Do later"
          className="cursor-pointer rounded-lg border border-black/10 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">Close</button>
      </div>
      <p className="mt-3 shrink-0 text-sm text-black/60 dark:text-white/60">These steps return after 90 days. You can resume them sooner.</p>
      <ul aria-label="Deferred objectives" className="mt-4 flex min-h-0 flex-col gap-2 overflow-y-auto overscroll-contain">
        {deferred.map(item => <li key={item.objectiveId} className="flex items-center justify-between gap-3 rounded-lg border border-black/10 p-3 dark:border-white/10">
          <span className="min-w-0 break-words text-sm">{item.title}</span>
          <button type="button" disabled={loading} onClick={() => onResume(item.objectiveId)}
            aria-label={`Resume ${item.title}`}
            className="shrink-0 cursor-pointer rounded-lg border border-black/10 px-3 py-2 text-sm hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:hover:bg-white/10">Resume</button>
        </li>)}
      </ul>
    </section>
  </Popup>;
}

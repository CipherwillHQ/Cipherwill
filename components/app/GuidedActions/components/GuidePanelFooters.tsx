// Displays objective progress and completion status within each guide slide.
// Owns inline footer layout that scrolls safely with tall slide content.
// Does not advance steps or position overlays over the account page.
import ProgressDots from "./ProgressDots";
import type { ObjectiveInProgress } from "../core/types";

export function ProgressFooter({ current }: { current: ObjectiveInProgress }) {
  return (
    <div>
      <ProgressDots
        total={current.result.stepsTotal ?? null}
        completed={current.result.stepsCompleted ?? null}
        skipped={current.result.stepsSkipped ?? null}
      />
    </div>
  );
}

export function TimedCountdownFooter({ countdownSeconds }: { countdownSeconds: number }) {
  return (
    <p
      className="text-xs md:text-sm text-black/60 dark:text-white/60"
    >
      Continuing in{" "}
      {Math.max(1, countdownSeconds)}s...
    </p>
  );
}

export function PostActionFooter({
  postActionStatus,
}: {
  postActionStatus: { title: string; subtext: string | null };
}) {
  return (
    <div
      className="w-full max-w-xl rounded-xl border border-default bg-secondary px-4 py-3 text-center shadow-sm"
    >
      <p className="text-sm md:text-base font-medium">{postActionStatus.title}</p>
      {postActionStatus.subtext ? (
        <p className="text-xs md:text-sm text-black/70 dark:text-white/70 mt-1">
          {postActionStatus.subtext}
        </p>
      ) : null}
    </div>
  );
}

import ProgressDots from "./ProgressDots";
import type { ObjectiveInProgress } from "../core/types";

export function ProgressFooter({ current }: { current: ObjectiveInProgress }) {
  return (
    <div
      className="fixed left-1/2 z-10 -translate-x-1/2"
      style={{ bottom: "calc(var(--cw-safe-bottom) + 1rem)" }}
    >
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
      className="fixed left-1/2 z-10 -translate-x-1/2 text-xs md:text-sm text-black/60 dark:text-white/60"
      style={{ bottom: "calc(var(--cw-safe-bottom) + 2.5rem)" }}
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
      className="fixed left-1/2 z-10 -translate-x-1/2 w-[min(90vw,40rem)] rounded-xl border border-default bg-secondary px-4 py-3 text-center shadow-sm"
      style={{ bottom: "calc(var(--cw-safe-bottom) + 2.5rem)" }}
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

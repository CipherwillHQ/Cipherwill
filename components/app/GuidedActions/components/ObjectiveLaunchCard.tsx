/**
 * Renders the compact guided-actions launch card shown in the page flow.
 * Owns responsive layout, call-to-action styling, and attention animation.
 * Does not run objective logic or mutate engine state.
 */
import { motion } from "framer-motion";
import GuidedButton from "./GuidedButton";
import type { ObjectiveInProgress } from "../core/types";

type ObjectiveLaunchCardProps = {
  current: ObjectiveInProgress | null;
  loading: boolean;
  error: string | null;
  onOpen: () => void;
};

export default function ObjectiveLaunchCard({
  current,
  loading,
  error,
  onOpen,
}: ObjectiveLaunchCardProps) {
  const objectiveTitle = current?.result.objectiveTitle ?? "Your next task is ready";
  const totalSteps = current?.result.stepsTotal ?? null;
  const completedSteps = current?.result.stepsCompleted ?? null;
  const hasStepProgress =
    typeof totalSteps === "number" &&
    totalSteps > 0 &&
    typeof completedSteps === "number" &&
    completedSteps >= 0;
  const nextStepNumber = hasStepProgress
    ? Math.min(totalSteps, Math.max(1, completedSteps + 1))
    : null;
  const stepLabel =
    hasStepProgress && nextStepNumber && totalSteps > 1
      ? `Step ${nextStepNumber} of ${totalSteps}`
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="mb-2 w-full rounded-lg border border-default bg-secondary p-4 md:p-5"
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60">
              Next step
            </p>
            {stepLabel ? (
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-black/30 dark:bg-white/30"
              />
            ) : null}
            {stepLabel ? (
              <p className="text-xs font-medium uppercase tracking-wide text-black/50 dark:text-white/50">
                {stepLabel}
              </p>
            ) : null}
          </div>
          <h2 className="mt-1 text-lg font-semibold leading-tight md:text-xl">
            {objectiveTitle}
          </h2>
        </div>
        <GuidedButton
          onClick={onOpen}
          disabled={loading}
          className="w-full sm:w-auto sm:min-w-35 sm:shrink-0"
        >
          {!loading ? (
            <span
              className="relative mr-2 inline-flex h-2.5 w-2.5 items-center justify-center"
              aria-hidden="true"
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-white/75 dark:bg-black/70"
                animate={{ scale: [1, 1, 1.9, 1], opacity: [0, 0, 0.7, 0] }}
                transition={{
                  duration: 1.15,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 1.35,
                }}
              />
              <span className="relative h-2.5 w-2.5 rounded-full bg-white dark:bg-black" />
            </span>
          ) : null}
          Continue
        </GuidedButton>
      </div>
      {error ? (
        <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </motion.div>
  );
}

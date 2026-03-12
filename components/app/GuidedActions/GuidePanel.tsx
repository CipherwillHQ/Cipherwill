import { AnimatePresence, motion } from "framer-motion";
import { SwitchThemeIcon } from "@/contexts/ThemeSelector";
import { useEffect, useMemo, useState } from "react";
import ActionContent from "./ActionContent";
import ActionControls from "./ActionControls";
import GuidedButton from "./GuidedButton";
import { isInputValid } from "./ActionContent";
import { coerceValueForInput } from "./engineCore";
import type { ObjectiveInProgress } from "./types";

export default function GuidePanel({
  current,
  loading,
  error,
  onClose,
  onRetry,
  onContinue,
  onSubmit,
}: {
  current: ObjectiveInProgress | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
  onContinue: () => void;
  onSubmit: (value: unknown) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [showIntro, setShowIntro] = useState(true);

  const currentInput = current?.result.input ?? null;
  const canSubmit = useMemo(
    () => isInputValid(currentInput, inputValue),
    [currentInput, inputValue]
  );
  const shouldAutoClose =
    Boolean(current?.result.closePanelAfterDisplay) &&
    typeof current?.result.displayForMs === "number" &&
    current.result.displayForMs > 0;
  const currentObjectiveId = current?.objectiveId ?? null;

  useEffect(() => {
    if (currentObjectiveId) {
      setShowIntro(true);
      setInputValue("");
    } else {
      setShowIntro(false);
    }
  }, [currentObjectiveId]);

  const contentStateKey = loading
    ? "loading"
    : error
      ? "error"
      : current
        ? showIntro
          ? `intro-${current.objectiveId}`
          : `objective-${current.objectiveId}-${current.result.step ?? "display"}-${current.result.title ?? ""}`
        : "empty";

  const submitWithCurrentValue = () => {
    if (!currentInput || !canSubmit) {
      return;
    }
    const normalized = coerceValueForInput(currentInput, inputValue.trim());
    onSubmit(normalized);
    setInputValue("");
  };

  const skipCurrentStep = () => {
    if (!currentInput?.key) {
      return;
    }
    onSubmit(null);
    setInputValue("");
  };

  const progressDots = (() => {
    if (!current) return null;
    const total = current.result.stepsTotal ?? null;
    const completed = current.result.stepsCompleted ?? null;
    const skipped = current.result.stepsSkipped ?? null;
    if (total === null || completed === null || skipped === null || total <= 0) return null;

    const boundedCompleted = Math.max(0, Math.min(completed, total));
    const boundedSkipped = Math.max(0, Math.min(skipped, total - boundedCompleted));
    const remaining = Math.max(0, total - boundedCompleted - boundedSkipped);

    return (
      <div className="flex items-center justify-center gap-2 pt-1" aria-label="Progress dots">
        {Array.from({ length: boundedCompleted }).map((_, i) => (
          <span
            key={`completed-${i}`}
            className="h-2.5 w-2.5 rounded-full bg-green-500"
            aria-label="Completed step"
          />
        ))}
        {Array.from({ length: boundedSkipped }).map((_, i) => (
          <span
            key={`skipped-${i}`}
            className="h-2.5 w-2.5 rounded-full bg-orange-500"
            aria-label="Skipped step"
          />
        ))}
        {Array.from({ length: remaining }).map((_, i) => (
          <span
            key={`remaining-${i}`}
            className="h-2.5 w-2.5 rounded-full border border-black/40 dark:border-white/40"
            aria-label="Remaining step"
          />
        ))}
      </div>
    );
  })();

  return (
    <motion.div
      className="absolute z-50 top-0 left-0 h-full w-full border border-default bg-secondary p-4 pb-14 md:p-8 md:pb-16 flex flex-col justify-between overflow-hidden"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="flex gap-2 items-center justify-between w-full">
        <h1 className="text-xl md:text-2xl font-semibold">Guided Panel</h1>
        <div className="flex gap-2 items-center">
          <SwitchThemeIcon />
          <GuidedButton variant="secondary" onClick={onClose}>
            Close
          </GuidedButton>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center p-2 md:p-4">
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div
              key={contentStateKey}
              initial={{ opacity: 0, x: 70 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -70 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="text-2xl md:text-3xl font-medium"
            >
              Loading guided action...
            </motion.div>
          ) : null}
          {!loading && error ? (
            <motion.div
              key={contentStateKey}
              initial={{ opacity: 0, x: 70 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -70 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 max-w-md"
            >
              <p className="text-base md:text-xl">{error}</p>
              <GuidedButton onClick={onRetry}>Retry</GuidedButton>
            </motion.div>
          ) : null}
          {!loading && !error && current ? (
            <motion.div
              key={contentStateKey}
              initial={{ opacity: 0, x: 70 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -70 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="w-full flex flex-col items-center gap-4"
            >
              {showIntro ? (
                <div className="w-full max-w-4xl p-1 md:p-2 flex flex-col gap-5 text-center">
                  <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
                    {current.result.objectiveTitle ?? "Guided objective"}
                  </h2>
                  <p className="text-base md:text-xl text-black/70 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
                    {current.result.objectiveDescription ?? "Let's complete this objective step by step."}
                  </p>
                  <div className="pt-1 flex justify-center">
                    <GuidedButton onClick={() => setShowIntro(false)}>
                      Start
                    </GuidedButton>
                  </div>
                </div>
              ) : (
                <>
                  <ActionContent
                    stepResult={current.result}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    submitValue={onSubmit}
                    loading={loading}
                  />
                  {!shouldAutoClose ? (
                    <ActionControls
                      stepResult={current.result}
                      isInputValid={canSubmit}
                      handleSkip={skipCurrentStep}
                      handleSubmit={submitWithCurrentValue}
                      handleContinue={onContinue}
                      loading={loading}
                    />
                  ) : null}
                </>
              )}
            </motion.div>
          ) : null}
          {!loading && !error && !current ? (
            <motion.div
              key={contentStateKey}
              initial={{ opacity: 0, x: 70 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -70 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-xl md:text-2xl">No guided actions available right now.</p>
              <GuidedButton onClick={onClose}>Done</GuidedButton>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {!loading && !error && current ? (
        <div className="absolute left-1/2 bottom-4 md:bottom-5 -translate-x-1/2">
          {progressDots}
        </div>
      ) : null}
      {!loading && !error && current && shouldAutoClose ? (
        <p className="absolute left-1/2 bottom-10 -translate-x-1/2 text-xs md:text-sm text-black/60 dark:text-white/60">
          Closing in {Math.ceil((current.result.displayForMs ?? 0) / 1000)}s...
        </p>
      ) : null}
    </motion.div>
  );
}

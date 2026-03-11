import SimpleButton from "@/components/common/SimpleButton";
import { AnimatePresence, motion } from "framer-motion";
import { SwitchThemeIcon } from "@/contexts/ThemeSelector";
import { useEffect, useMemo, useState } from "react";
import ActionContent from "./ActionContent";
import ActionControls from "./ActionControls";
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
  onSkip,
}: {
  current: ObjectiveInProgress | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
  onContinue: () => void;
  onSubmit: (value: unknown) => void;
  onSkip: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [showIntro, setShowIntro] = useState(true);

  const currentInput = current?.result.input ?? null;
  const canSubmit = useMemo(
    () => isInputValid(currentInput, inputValue),
    [currentInput, inputValue]
  );
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

  return (
    <motion.div
      className="absolute z-50 top-0 left-0 h-full w-full border border-default bg-secondary p-4 md:p-6 flex flex-col justify-between overflow-hidden"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="flex gap-2 items-center justify-between w-full">
        <h1>Guided Panel</h1>
        <div className="flex gap-2 items-center">
          <SwitchThemeIcon />
          <SimpleButton onClick={onClose}>
            Close
          </SimpleButton>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center p-2">
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div
              key={contentStateKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-lg"
            >
              Loading guided action...
            </motion.div>
          ) : null}
          {!loading && error ? (
            <motion.div
              key={contentStateKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center gap-3 max-w-md"
            >
              <p className="text-sm md:text-base">{error}</p>
              <SimpleButton onClick={onRetry}>Retry</SimpleButton>
            </motion.div>
          ) : null}
          {!loading && !error && current ? (
            <motion.div
              key={contentStateKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full flex flex-col items-center gap-4"
            >
              {showIntro ? (
                <div className="w-full max-w-xl rounded-xl border border-default p-4 md:p-5 flex flex-col gap-3 text-center">
                  <h2 className="text-xl md:text-2xl font-medium">
                    {current.result.objectiveTitle ?? "Guided objective"}
                  </h2>
                  <p className="text-sm md:text-base text-black/70 dark:text-white/70">
                    {current.result.objectiveDescription ?? "Let's complete this objective step by step."}
                  </p>
                  {typeof current.result.stepsRemaining === "number" &&
                  typeof current.result.stepsTotal === "number" ? (
                    <p className="text-xs md:text-sm text-black/60 dark:text-white/60">
                      {current.result.stepsRemaining} step
                      {current.result.stepsRemaining === 1 ? "" : "s"} left of{" "}
                      {current.result.stepsTotal}
                    </p>
                  ) : null}
                  <div className="pt-1">
                    <SimpleButton onClick={() => setShowIntro(false)}>
                      Start objective
                    </SimpleButton>
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
                  <ActionControls
                    stepResult={current.result}
                    isInputValid={canSubmit}
                    handleSkip={onSkip}
                    handleSubmit={submitWithCurrentValue}
                    handleContinue={onContinue}
                    loading={loading}
                  />
                </>
              )}
            </motion.div>
          ) : null}
          {!loading && !error && !current ? (
            <motion.div
              key={contentStateKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center gap-3"
            >
              <p className="text-lg">No guided actions available right now.</p>
              <SimpleButton onClick={onClose}>Done</SimpleButton>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { SwitchThemeIcon } from "@/contexts/ThemeSelector";
import { useEffect, useMemo, useState } from "react";
import ActionContent from "./ActionContent";
import ActionControls from "./ActionControls";
import GuidedButton from "./GuidedButton";
import ProgressDots from "./ProgressDots";
import { coerceValueForInput } from "../core/engineCore";
import { isInputValid } from "../core/inputValidation";
import type { ObjectiveInProgress } from "../core/types";

type GuidePanelProps = {
  current: ObjectiveInProgress | null;
  loading: boolean;
  error: string | null;
  postActionStatus: { title: string; subtext: string | null } | null;
  onClose: () => void;
  onRetry: () => void;
  onContinue: () => void;
  onSubmit: (value: unknown) => void;
};

function getContentStateKey(args: {
  loading: boolean;
  error: string | null;
  current: ObjectiveInProgress | null;
  showIntro: boolean;
}) {
  if (args.loading) {
    return "loading";
  }
  if (args.error) {
    return "error";
  }
  if (!args.current) {
    return "empty";
  }
  if (args.showIntro) {
    return `intro-${args.current.objectiveId}`;
  }

  return `objective-${args.current.objectiveId}-${args.current.result.step ?? "display"}-${args.current.result.title ?? ""}`;
}

export default function GuidePanel({
  current,
  loading,
  error,
  postActionStatus,
  onClose,
  onRetry,
  onContinue,
  onSubmit,
}: GuidePanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);

  const currentInput = current?.result.input ?? null;
  const canSubmit = useMemo(
    () => isInputValid(currentInput, inputValue),
    [currentInput, inputValue]
  );
  const isTimedDisplayStep =
    !currentInput &&
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

  useEffect(() => {
    if (!isTimedDisplayStep) {
      setCountdownSeconds(0);
      return;
    }

    const durationMs = current?.result.displayForMs ?? 0;
    const targetTime = Date.now() + durationMs;

    const tick = () => {
      const remainingMs = Math.max(0, targetTime - Date.now());
      setCountdownSeconds(Math.ceil(remainingMs / 1000));
    };

    tick();
    const interval = window.setInterval(tick, 200);
    return () => {
      window.clearInterval(interval);
    };
  }, [
    isTimedDisplayStep,
    current?.objectiveId,
    current?.result.step,
    current?.result.title,
    current?.result.displayForMs,
  ]);

  const contentStateKey = getContentStateKey({
    loading,
    error,
    current,
    showIntro,
  });

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

  return (
    <motion.div
      className="fixed z-50 inset-x-0 top-0 w-full border border-default bg-secondary p-4 md:p-8 flex flex-col overflow-y-auto overscroll-contain"
      style={{
        minHeight: "100vh",
        height: "100dvh",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 3.5rem)",
      }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="sticky top-0 z-10 flex gap-2 items-center justify-between w-full bg-secondary pb-2">
        <h1 className="text-xl md:text-2xl font-semibold">Guided Panel</h1>
        <div className="flex gap-2 items-center">
          <SwitchThemeIcon />
          <GuidedButton variant="secondary" onClick={onClose}>
            Close
          </GuidedButton>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-start md:justify-center text-center p-2 md:p-4">
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
                    submitTextValue={submitWithCurrentValue}
                    loading={loading}
                  />
                  {!isTimedDisplayStep ? (
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
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
        >
          <ProgressDots
            total={current.result.stepsTotal ?? null}
            completed={current.result.stepsCompleted ?? null}
            skipped={current.result.stepsSkipped ?? null}
          />
        </div>
      ) : null}
      {!loading && !error && current && isTimedDisplayStep && !postActionStatus ? (
        <p
          className="absolute left-1/2 -translate-x-1/2 text-xs md:text-sm text-black/60 dark:text-white/60"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 2.5rem)" }}
        >
          Continuing in{" "}
          {Math.max(1, countdownSeconds)}s...
        </p>
      ) : null}
      {!loading && !error && current && postActionStatus ? (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[min(90vw,40rem)] rounded-xl border border-default bg-secondary px-4 py-3 text-center shadow-sm"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 2.5rem)" }}
        >
          <p className="text-sm md:text-base font-medium">{postActionStatus.title}</p>
          {postActionStatus.subtext ? (
            <p className="text-xs md:text-sm text-black/70 dark:text-white/70 mt-1">
              {postActionStatus.subtext}
            </p>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
}

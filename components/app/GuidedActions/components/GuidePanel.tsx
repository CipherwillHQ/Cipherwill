import { AnimatePresence, motion } from "framer-motion";
import { SwitchThemeIcon } from "@/contexts/ThemeSelector";
import { useEffect, useMemo, useState } from "react";
import GuidedButton from "./GuidedButton";
import {
  EmptyState,
  ErrorState,
  IntroState,
  LoadingState,
  StepState,
} from "./GuidePanelContentStates";
import {
  PostActionFooter,
  ProgressFooter,
  TimedCountdownFooter,
} from "./GuidePanelFooters";
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

type PanelViewState = "loading" | "error" | "empty" | "intro" | "step" | "timed";

function getContentStateKey(args: {
  viewState: PanelViewState;
  current: ObjectiveInProgress | null;
}) {
  if (!args.current) {
    return args.viewState;
  }
  if (args.viewState === "intro") {
    return `intro-${args.current.objectiveId}`;
  }

  return `objective-${args.current.objectiveId}-${args.current.result.step ?? "display"}-${args.current.result.title ?? ""}`;
}

function getPanelViewState(args: {
  showLoadingState: boolean;
  error: string | null;
  current: ObjectiveInProgress | null;
  showIntro: boolean;
  isTimedDisplayStep: boolean;
}): PanelViewState {
  if (args.showLoadingState) {
    return "loading";
  }
  if (args.error) {
    return "error";
  }
  if (!args.current) {
    return "empty";
  }
  if (args.showIntro) {
    return "intro";
  }
  if (args.isTimedDisplayStep) {
    return "timed";
  }
  return "step";
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
  const loadingPhrases = useMemo(
    () => [
      "Preparing your next step...",
      "Reviewing what to do next...",
      "Organizing your action plan...",
      "Checking progress and context...",
      "Getting the next task ready...",
      "Syncing your latest updates...",
      "Almost there, setting things up...",
    ],
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(0);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

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

  useEffect(() => {
    if (!loading) {
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 1400);

    return () => {
      window.clearInterval(interval);
    };
  }, [loading, loadingPhrases]);

  const showLoadingState = loading && !current;
  const viewState = getPanelViewState({
    showLoadingState,
    error,
    current,
    showIntro,
    isTimedDisplayStep,
  });
  const contentStateKey = getContentStateKey({ viewState, current });
  const canShowProgress = !error && !!current;

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

  const renderState = () => {
    switch (viewState) {
      case "loading":
        return <LoadingState stateKey={contentStateKey} phrase={loadingPhrases[loadingPhraseIndex]} />;
      case "error":
        return <ErrorState stateKey={contentStateKey} error={error ?? "Something went wrong."} onRetry={onRetry} />;
      case "empty":
        return <EmptyState stateKey={contentStateKey} onClose={onClose} />;
      case "intro":
        return current ? (
          <IntroState stateKey={contentStateKey} current={current} onStart={() => setShowIntro(false)} />
        ) : null;
      case "timed":
        return current ? (
          <StepState
            stateKey={contentStateKey}
            current={current}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSubmit={onSubmit}
            submitWithCurrentValue={submitWithCurrentValue}
            skipCurrentStep={skipCurrentStep}
            onContinue={onContinue}
            canSubmit={canSubmit}
            loading={loading}
            showControls={false}
          />
        ) : null;
      case "step":
        return current ? (
          <StepState
            stateKey={contentStateKey}
            current={current}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSubmit={onSubmit}
            submitWithCurrentValue={submitWithCurrentValue}
            skipCurrentStep={skipCurrentStep}
            onContinue={onContinue}
            canSubmit={canSubmit}
            loading={loading}
            showControls
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fixed z-50 inset-x-0 cw-safe-overlay w-full border border-default bg-secondary p-4 pb-14 md:p-8 md:pb-16 flex flex-col overflow-y-auto overscroll-contain"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="sticky top-0 z-10 flex gap-2 items-center justify-between w-full bg-secondary pb-2">
        <h1 className="text-xl md:text-2xl font-semibold">Assistant</h1>
        <div className="flex gap-2 items-center">
          <SwitchThemeIcon />
          <GuidedButton variant="secondary" onClick={onClose}>
            Close
          </GuidedButton>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center p-2 md:p-4">
        <motion.div
          layout
          transition={{ layout: { duration: 0.24, ease: "easeOut" } }}
          className="w-full max-w-4xl min-h-[18rem] md:min-h-[22rem] flex flex-col items-center justify-center"
        >
          <AnimatePresence initial={false} mode="wait">{renderState()}</AnimatePresence>
        </motion.div>
      </div>
      {canShowProgress && current ? <ProgressFooter current={current} /> : null}
      {canShowProgress && current && isTimedDisplayStep && !postActionStatus ? (
        <TimedCountdownFooter countdownSeconds={countdownSeconds} />
      ) : null}
      {canShowProgress && current && postActionStatus ? (
        <PostActionFooter postActionStatus={postActionStatus} />
      ) : null}
    </motion.div>
  );
}

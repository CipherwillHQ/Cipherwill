import { motion } from "framer-motion";
import { type ReactNode } from "react";
import ActionContent from "./ActionContent";
import ActionControls from "./ActionControls";
import GuidedButton from "./GuidedButton";
import type { ObjectiveInProgress } from "../core/types";

function AnimatedStatePane({ stateKey, className, children }: {
  stateKey: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      key={stateKey}
      initial={{ opacity: 0, x: 70 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -70 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LoadingState({
  stateKey,
  phrase,
}: {
  stateKey: string;
  phrase: string;
}) {
  return (
    <AnimatedStatePane
      stateKey={stateKey}
      className="flex items-center gap-3 text-xl md:text-2xl font-medium text-black/55 dark:text-white/55"
    >
      <span className="h-5 w-5 rounded-full border-2 border-current border-r-transparent animate-spin" />
      {phrase}
    </AnimatedStatePane>
  );
}

export function ErrorState({
  stateKey,
  error,
  onRetry,
}: {
  stateKey: string;
  error: string;
  onRetry: () => void;
}) {
  return (
    <AnimatedStatePane stateKey={stateKey} className="flex flex-col items-center gap-3 max-w-md">
      <p className="text-base md:text-xl">{error}</p>
      <GuidedButton onClick={onRetry}>Retry</GuidedButton>
    </AnimatedStatePane>
  );
}

export function EmptyState({
  stateKey,
  onClose,
}: {
  stateKey: string;
  onClose: () => void;
}) {
  return (
    <AnimatedStatePane stateKey={stateKey} className="flex flex-col items-center gap-3">
      <p className="text-xl md:text-2xl">No guided actions available right now.</p>
      <GuidedButton onClick={onClose}>Done</GuidedButton>
    </AnimatedStatePane>
  );
}

export function IntroState({
  stateKey,
  current,
  onStart,
}: {
  stateKey: string;
  current: ObjectiveInProgress;
  onStart: () => void;
}) {
  return (
    <AnimatedStatePane stateKey={stateKey} className="w-full flex flex-col items-center gap-4">
      <div className="w-full max-w-4xl p-1 md:p-2 flex flex-col gap-5 text-center">
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
          {current.result.objectiveTitle ?? "Guided objective"}
        </h2>
        <p className="text-base md:text-xl text-black/70 dark:text-white/70 leading-relaxed max-w-3xl mx-auto">
          {current.result.objectiveDescription ?? "Let's complete this objective step by step."}
        </p>
        <div className="pt-1 flex justify-center">
          <GuidedButton onClick={onStart}>Start</GuidedButton>
        </div>
      </div>
    </AnimatedStatePane>
  );
}

export function StepState({
  stateKey,
  current,
  inputValue,
  setInputValue,
  onSubmit,
  submitWithCurrentValue,
  skipCurrentStep,
  onContinue,
  canSubmit,
  loading,
  showControls,
}: {
  stateKey: string;
  current: ObjectiveInProgress;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (value: unknown) => void;
  submitWithCurrentValue: () => void;
  skipCurrentStep: () => void;
  onContinue: () => void;
  canSubmit: boolean;
  loading: boolean;
  showControls: boolean;
}) {
  return (
    <AnimatedStatePane stateKey={stateKey} className="w-full flex flex-col items-center gap-4">
      <ActionContent
        stepResult={current.result}
        inputValue={inputValue}
        setInputValue={setInputValue}
        submitValue={onSubmit}
        submitTextValue={submitWithCurrentValue}
        loading={loading}
      />
      {showControls ? (
        <ActionControls
          stepResult={current.result}
          isInputValid={canSubmit}
          handleSkip={skipCurrentStep}
          handleSubmit={submitWithCurrentValue}
          handleContinue={onContinue}
          loading={loading}
        />
      ) : null}
    </AnimatedStatePane>
  );
}

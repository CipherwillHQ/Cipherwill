import SimpleButton from "@/components/common/SimpleButton";
import { motion } from "framer-motion";
import { SwitchThemeIcon } from "@/contexts/ThemeSelector";
import { useMemo, useState } from "react";
import ActionContent from "./ActionContent";
import ActionControls from "./ActionControls";
import { isInputValid } from "./ActionContent";
import { coerceValueForInput } from "./engineCore";
import type { ObjectiveInProgress } from "./types";

export default function GuidePanel({
  current,
  loading,
  error,
  setShowGuidedActions,
  onRetry,
  onContinue,
  onSubmit,
  onSkip,
}: {
  current: ObjectiveInProgress | null;
  loading: boolean;
  error: string | null;
  setShowGuidedActions: (value: boolean) => void;
  onRetry: () => void;
  onContinue: () => void;
  onSubmit: (value: unknown) => void;
  onSkip: () => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const currentInput = current?.result.input ?? null;
  const canSubmit = useMemo(
    () => isInputValid(currentInput, inputValue),
    [currentInput, inputValue]
  );

  const closePanel = () => {
    setShowGuidedActions(false);
  };

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
          <SimpleButton onClick={closePanel}>
            Close
          </SimpleButton>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center p-2">
        {loading ? <div className="text-lg">Loading guided action...</div> : null}
        {!loading && error ? (
          <div className="flex flex-col items-center gap-3 max-w-md">
            <p className="text-sm md:text-base">{error}</p>
            <SimpleButton onClick={onRetry}>Retry</SimpleButton>
          </div>
        ) : null}
        {!loading && !error && current ? (
          <ActionContent
            stepResult={current.result}
            inputValue={inputValue}
            setInputValue={setInputValue}
            submitValue={onSubmit}
            loading={loading}
          />
        ) : null}
        {!loading && !error && !current ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg">No guided actions available right now.</p>
            <SimpleButton onClick={closePanel}>Done</SimpleButton>
          </div>
        ) : null}
      </div>
      {!loading && !error && current ? (
        <ActionControls
          stepResult={current.result}
          isInputValid={canSubmit}
          handleSkip={onSkip}
          handleSubmit={submitWithCurrentValue}
          handleContinue={onContinue}
          loading={loading}
        />
      ) : null}
    </motion.div>
  );
}

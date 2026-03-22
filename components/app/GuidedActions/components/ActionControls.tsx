import GuidedButton from "./GuidedButton";
import type { ObjectiveProcessResult } from "../core/types";

interface ActionControlsProps {
  stepResult: ObjectiveProcessResult;
  isInputValid: boolean;
  handleSkip: () => void;
  handleSubmit: () => void;
  handleContinue: () => void;
  loading: boolean;
}

export default function ActionControls({
  stepResult,
  isInputValid,
  handleSkip,
  handleSubmit,
  handleContinue,
  loading,
}: ActionControlsProps) {
  const inputSpec = stepResult.input;
  const hasInput = !!inputSpec;
  const isBooleanInput = inputSpec?.type === "boolean";
  const isSkippable = !!inputSpec?.skippable;

  return (
    <div className="flex gap-4 items-center justify-center flex-wrap mt-2">
      {isSkippable && (
        <GuidedButton variant="secondary" onClick={handleSkip} disabled={loading}>
          Skip
        </GuidedButton>
      )}
      {!hasInput ? (
        <GuidedButton onClick={handleContinue} disabled={loading}>
          Continue
        </GuidedButton>
      ) : null}
      {hasInput && !isBooleanInput ? (
        <GuidedButton onClick={handleSubmit} disabled={loading || !isInputValid}>
          Submit
        </GuidedButton>
      ) : null}
    </div>
  );
}

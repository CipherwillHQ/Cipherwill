import SimpleButton from "@/components/common/SimpleButton";
import type { ObjectiveProcessResult } from "./types";

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
    <div className="flex gap-4 items-center justify-center flex-wrap">
      {isSkippable && (
        <SimpleButton onClick={handleSkip} disabled={loading}>
          Skip
        </SimpleButton>
      )}
      {!hasInput ? (
        <SimpleButton onClick={handleContinue} disabled={loading}>
          Continue
        </SimpleButton>
      ) : null}
      {hasInput && !isBooleanInput && isInputValid ? (
        <SimpleButton onClick={handleSubmit} disabled={loading}>
          Submit
        </SimpleButton>
      ) : null}
    </div>
  );
}

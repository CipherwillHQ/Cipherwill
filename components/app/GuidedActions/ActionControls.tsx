import SimpleButton from "@/components/common/SimpleButton";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex gap-4 items-center justify-center flex-wrap"
    >
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
    </motion.div>
  );
}

import { motion } from "framer-motion";
import StepInputField from "./StepInputField";
import type { ObjectiveProcessResult } from "../core/types";

export interface ActionContentProps {
  stepResult: ObjectiveProcessResult;
  inputValue: string;
  setInputValue: (value: string) => void;
  submitValue: (value: unknown) => void;
  submitTextValue: () => void;
  loading: boolean;
}

export default function ActionContent({
  stepResult,
  inputValue,
  setInputValue,
  submitValue,
  submitTextValue,
  loading,
}: ActionContentProps) {
  const inputSpec = stepResult.input;

  return (
    <motion.div
      key={`${stepResult.step ?? "display"}-${stepResult.title ?? "objective-step"}`}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="flex w-full max-w-4xl flex-col items-center gap-7 text-center"
    >
      <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
        {stepResult.title || "Guided Action"}
      </h2>
      {stepResult.subtext ? (
        <p className="max-w-2xl text-base md:text-xl text-black/70 dark:text-white/70 leading-relaxed">
          {stepResult.subtext}
        </p>
      ) : null}
      <StepInputField
        inputSpec={inputSpec}
        inputValue={inputValue}
        onChange={setInputValue}
        onSubmitBoolean={(value) => submitValue(value)}
        onSubmitText={submitTextValue}
        loading={loading}
      />
    </motion.div>
  );
}

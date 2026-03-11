import { motion } from "framer-motion";
import SimpleButton from "@/components/common/SimpleButton";
import type { ObjectiveInputSpec, ObjectiveProcessResult } from "./types";

interface ActionContentProps {
  stepResult: ObjectiveProcessResult;
  inputValue: string;
  setInputValue: (value: string) => void;
  submitValue: (value: unknown) => void;
  loading: boolean;
}

export function isInputValid(
  inputSpec: ObjectiveInputSpec | null,
  value: string
): boolean {
  if (!inputSpec || inputSpec.type === "boolean") {
    return true;
  }
  const normalized = value.trim();
  if (!normalized.length) {
    return false;
  }
  if (typeof inputSpec.minLength === "number" && normalized.length < inputSpec.minLength) {
    return false;
  }
  if (typeof inputSpec.maxLength === "number" && normalized.length > inputSpec.maxLength) {
    return false;
  }
  if (inputSpec.type === "number") {
    const numericValue = Number(normalized);
    if (!Number.isFinite(numericValue)) {
      return false;
    }
    if (typeof inputSpec.min === "number" && numericValue < inputSpec.min) {
      return false;
    }
    if (typeof inputSpec.max === "number" && numericValue > inputSpec.max) {
      return false;
    }
  }
  return true;
}

export default function ActionContent({
  stepResult,
  inputValue,
  setInputValue,
  submitValue,
  loading,
}: ActionContentProps) {
  const inputSpec = stepResult.input;
  const inputType = inputSpec?.type ?? null;

  return (
    <motion.div
      key={stepResult.step ?? "objective-step"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex w-full flex-col items-center gap-5 text-center"
    >
      <h2 className="text-xl md:text-2xl font-medium">
        {stepResult.title || "Guided Action"}
      </h2>
      {stepResult.subtext ? (
        <p className="max-w-xl text-sm md:text-base text-black/70 dark:text-white/70">
          {stepResult.subtext}
        </p>
      ) : null}
      {inputType === "boolean" ? (
        <div className="flex flex-wrap justify-center gap-3">
          <SimpleButton onClick={() => submitValue(true)} disabled={loading}>
            Yes
          </SimpleButton>
          <SimpleButton onClick={() => submitValue(false)} disabled={loading}>
            No
          </SimpleButton>
        </div>
      ) : null}
      {inputType === "email" || inputType === "string" ? (
        <input
          type={inputType === "email" ? "email" : "text"}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={inputSpec?.placeholder ?? "Enter value"}
          minLength={inputSpec?.minLength ?? undefined}
          maxLength={inputSpec?.maxLength ?? undefined}
          className="w-full max-w-md rounded border border-default px-3 py-2"
        />
      ) : null}
      {inputType === "text" ? (
        <textarea
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={inputSpec?.placeholder ?? "Enter value"}
          minLength={inputSpec?.minLength ?? undefined}
          maxLength={inputSpec?.maxLength ?? undefined}
          rows={5}
          className="w-full max-w-md rounded border border-default px-3 py-2"
        />
      ) : null}
      {inputType === "number" ? (
        <input
          type="number"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={inputSpec?.placeholder ?? "Enter number"}
          min={inputSpec?.min ?? undefined}
          max={inputSpec?.max ?? undefined}
          className="w-full max-w-md rounded border border-default px-3 py-2"
        />
      ) : null}
    </motion.div>
  );
}

import { motion } from "framer-motion";
import GuidedButton from "./GuidedButton";
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
  if (inputSpec.type === "choices") {
    const options = (inputSpec.choices ?? []).map((choice) => String(choice));
    return options.includes(normalized);
  }
  if (inputSpec.type === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
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
  const choiceOptions = (inputSpec?.choices ?? []).map((choice) => String(choice));

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
      {inputType === "boolean" ? (
        <div className="flex flex-wrap justify-center gap-3">
          <GuidedButton onClick={() => submitValue(true)} disabled={loading}>
            Yes
          </GuidedButton>
          <GuidedButton variant="secondary" onClick={() => submitValue(false)} disabled={loading}>
            No
          </GuidedButton>
        </div>
      ) : null}
      {inputType === "email" || inputType === "single_line_text" ? (
        <input
          type={inputType === "email" ? "email" : "text"}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={inputSpec?.placeholder ?? "Enter value"}
          minLength={inputSpec?.minLength ?? undefined}
          maxLength={inputSpec?.maxLength ?? undefined}
          className="w-full max-w-2xl rounded-xl border border-default px-4 py-3 text-lg md:text-xl"
        />
      ) : null}
      {inputType === "multi_line_text" ? (
        <textarea
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={inputSpec?.placeholder ?? "Enter value"}
          minLength={inputSpec?.minLength ?? undefined}
          maxLength={inputSpec?.maxLength ?? undefined}
          rows={5}
          className="w-full max-w-2xl rounded-xl border border-default px-4 py-3 text-lg md:text-xl"
        />
      ) : null}
      {inputType === "choices" ? (
        <select
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          className="w-full max-w-2xl rounded-xl border border-default px-4 py-3 bg-transparent text-lg md:text-xl"
        >
          <option value="" disabled>
            {inputSpec?.placeholder ?? "Select an option"}
          </option>
          {choiceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : null}
      {inputType === "number" ? (
        <input
          type="number"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={inputSpec?.placeholder ?? "Enter number"}
          min={inputSpec?.min ?? undefined}
          max={inputSpec?.max ?? undefined}
          className="w-full max-w-2xl rounded-xl border border-default px-4 py-3 text-lg md:text-xl"
        />
      ) : null}
    </motion.div>
  );
}

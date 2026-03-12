import GuidedButton from "./GuidedButton";
import type { ObjectiveInputSpec } from "../core/types";

const INPUT_CLASS_NAME =
  "w-full max-w-2xl rounded-xl border border-default px-4 py-3 text-lg md:text-xl";

export default function StepInputField({
  inputSpec,
  inputValue,
  onChange,
  onSubmitBoolean,
  onSubmitText,
  loading,
}: {
  inputSpec: ObjectiveInputSpec | null;
  inputValue: string;
  onChange: (value: string) => void;
  onSubmitBoolean: (value: boolean) => void;
  onSubmitText: () => void;
  loading: boolean;
}) {
  const inputType = inputSpec?.type ?? null;
  const choiceOptions = (inputSpec?.choices ?? []).map((choice) => String(choice));

  if (inputType === "boolean") {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        <GuidedButton onClick={() => onSubmitBoolean(true)} disabled={loading}>
          Yes
        </GuidedButton>
        <GuidedButton
          variant="secondary"
          onClick={() => onSubmitBoolean(false)}
          disabled={loading}
        >
          No
        </GuidedButton>
      </div>
    );
  }

  if (inputType === "email" || inputType === "single_line_text") {
    return (
      <input
        type={inputType === "email" ? "email" : "text"}
        value={inputValue}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmitText();
          }
        }}
        placeholder={inputSpec?.placeholder ?? "Enter value"}
        minLength={inputSpec?.minLength ?? undefined}
        maxLength={inputSpec?.maxLength ?? undefined}
        className={INPUT_CLASS_NAME}
      />
    );
  }

  if (inputType === "multi_line_text") {
    return (
      <textarea
        value={inputValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder={inputSpec?.placeholder ?? "Enter value"}
        minLength={inputSpec?.minLength ?? undefined}
        maxLength={inputSpec?.maxLength ?? undefined}
        rows={5}
        className={INPUT_CLASS_NAME}
      />
    );
  }

  if (inputType === "date") {
    return (
      <input
        type="date"
        value={inputValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder={inputSpec?.placeholder ?? "Select date"}
        className={INPUT_CLASS_NAME}
      />
    );
  }

  if (inputType === "choices") {
    return (
      <select
        value={inputValue}
        onChange={(event) => onChange(event.target.value)}
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
    );
  }

  if (inputType === "number") {
    return (
      <input
        type="number"
        value={inputValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder={inputSpec?.placeholder ?? "Enter number"}
        min={inputSpec?.min ?? undefined}
        max={inputSpec?.max ?? undefined}
        className={INPUT_CLASS_NAME}
      />
    );
  }

  return null;
}

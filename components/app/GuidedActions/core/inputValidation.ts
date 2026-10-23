// Checks local input constraints before a conversation transition.
// Owns immediate field validation for browser questions.
// Does not replace server validation at the final-save boundary.
import type { ObjectiveInputSpec } from "@/types/interfaces";
import { isGuidanceDateValid } from "./dateValidation";
import { prepareGuidanceInput } from "./inputValue";

export function isInputValid(
  inputSpec: ObjectiveInputSpec | null,
  value: string
): boolean {
  if (!inputSpec || inputSpec.type === "boolean") {
    return true;
  }
  if (inputSpec.type === "file") return false;

  const normalized = prepareGuidanceInput(inputSpec, value);
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

  if (inputSpec.type === "date") {
    return isGuidanceDateValid(normalized, inputSpec.minDate, inputSpec.maxDate);
  }

  if (inputSpec.pattern && !new RegExp(inputSpec.pattern).test(normalized)) return false;

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

import type { ObjectiveInputSpec } from "./types";

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

  if (inputSpec.type === "date") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
      return false;
    }
    const date = new Date(`${normalized}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const [year, month, day] = normalized.split("-").map((x) => parseInt(x, 10));
    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day
    ) {
      return false;
    }

    if (date.getTime() > Date.now()) {
      return false;
    }

    return year >= 1900;
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

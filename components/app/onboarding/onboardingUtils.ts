/**
 * Validation and immutable list helpers for onboarding flow state.
 * Keeps component files focused on rendering and event wiring.
 */
import { OnboardingOption } from "./types";

export const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
};

export const normalizeOptionArray = (value: unknown): OnboardingOption[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const id = typeof (item as { id?: unknown }).id === "string"
        ? (item as { id: string }).id.trim()
        : "";
      const label = typeof (item as { label?: unknown }).label === "string"
        ? (item as { label: string }).label.trim()
        : "";
      const requires_custom_text =
        (item as { requires_custom_text?: unknown }).requires_custom_text === true;
      if (!id || !label) return null;
      return { id, label, requires_custom_text };
    })
    .filter((item): item is OnboardingOption => Boolean(item));
};

export const toggleStringInList = (items: string[], value: string): string[] => {
  if (items.includes(value)) {
    return items.filter((item) => item !== value);
  }
  return [...items, value];
};

export const isStepOneComplete = (
  selectedOption: OnboardingOption | null,
  heardFromCustom: string
): boolean => {
  if (!selectedOption) return false;
  if (!selectedOption.requires_custom_text) return true;
  return heardFromCustom.trim().length > 0;
};

export const isStepTwoComplete = (
  selectedOptions: OnboardingOption[],
  expectationsCustom: string
): boolean => {
  if (selectedOptions.length === 0) return false;
  const hasCustomOption = selectedOptions.some(
    (item) => item.requires_custom_text
  );
  if (!hasCustomOption) return true;
  return expectationsCustom.trim().length > 0;
};

/** Fisher-Yates shuffle — returns a new array, does not mutate the input. */
export const shuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

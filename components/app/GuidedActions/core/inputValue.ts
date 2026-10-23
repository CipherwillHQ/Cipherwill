// Prepares guided field values without altering sensitive inputs.
// Owns whitespace preservation for credentials and trimming for ordinary answers.
// Does not validate inputs or persist draft values.
import type { ObjectiveInputSpec } from "@/types/interfaces";

export function prepareGuidanceInput(input: ObjectiveInputSpec, value: string) {
  return input.sensitive ? value : value.trim();
}

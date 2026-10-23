// Validates selected files before placing them in transient guidance memory.
// Owns the explicit filename used by local review and the original file reference.
// Does not read file contents or persist the selection.
import type { GuidanceFileAnswer } from "@/types/interfaces";

export function normalizeGuidanceFile(value: unknown): GuidanceFileAnswer {
  if (typeof File === "undefined" || !(value instanceof File)) throw new Error("Please choose a file.");
  return { name: value.name, file: value };
}

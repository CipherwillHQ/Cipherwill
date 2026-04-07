import { RestoreStep } from "./types";

export class RestoreStepError extends Error {
  step: RestoreStep;
  originalError?: unknown;

  constructor(step: RestoreStep, message: string, originalError?: unknown) {
    super(message);
    this.step = step;
    this.originalError = originalError;
    this.name = "RestoreStepError";
  }
}

import { BackupStep } from "./types";

export class BackupStepError extends Error {
  step: BackupStep;
  originalError?: unknown;

  constructor(step: BackupStep, message: string, originalError?: unknown) {
    super(message);
    this.step = step;
    this.originalError = originalError;
    this.name = "BackupStepError";
  }
}

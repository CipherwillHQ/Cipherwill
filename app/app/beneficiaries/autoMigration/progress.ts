import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import type { MigrationProgressState, MigrationTargetResult } from "./types";

export type SetMigrationProgress = Dispatch<
  SetStateAction<MigrationProgressState>
>;

export const INITIAL_PROGRESS: MigrationProgressState = {
  open: false,
  status: "running",
  title: "",
  description: "",
};

export const setAddingProgress = (
  setMigrationProgress: SetMigrationProgress
) => {
  setMigrationProgress({
    open: true,
    status: "running",
    title: "Adding beneficiary",
    description: "Creating beneficiary record and preparing migration...",
  });
};

export const setMigratingProgress = (
  setMigrationProgress: SetMigrationProgress
) => {
  setMigrationProgress({
    open: true,
    status: "running",
    title: "Migrating data",
    description: "Please wait while data is synced for this beneficiary.",
  });
};

export const handleBlockedMigration = (
  result: MigrationTargetResult,
  setMigrationProgress: SetMigrationProgress
) => {
  if (result.ok) return;

  if (result.reason === "missing-added-beneficiary") {
    setMigrationProgress({
      open: true,
      status: "failed",
      title: "Migration not started",
      description:
        "Beneficiary was added, but auto-migration could not start. Please use Click to Migrate.",
    });
    toast.error(
      "Beneficiary was added, but could not auto-start migration. Use Click to Migrate."
    );
    return;
  }

  setMigrationProgress({
    open: true,
    status: "failed",
    title: "Migration needs a different key",
    description:
      "Beneficiary is added, but auto-migration needs your active session on the latest factor key.",
  });
  toast.error(
    "Beneficiary added. Switch session to key " +
      result.requiredKeySuffix +
      " and click migrate."
  );
};

export const setMigrationSuccess = (
  setMigrationProgress: SetMigrationProgress
) => {
  setMigrationProgress({
    open: true,
    status: "success",
    title: "Migration completed",
    description: "Beneficiary is now in sync.",
  });
  setTimeout(() => {
    setMigrationProgress((prev) => ({
      ...prev,
      open: false,
    }));
  }, 1000);
};

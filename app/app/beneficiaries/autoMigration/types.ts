export type MigrationProgressState = {
  open: boolean;
  status: "running" | "success" | "failed";
  title: string;
  description: string;
};

export type BeneficiaryRecord = {
  id: string;
  person_id: string;
};

export type AutoMigrationBlockedReason =
  | "missing-added-beneficiary"
  | "key-mismatch";

export type MigrationTargetResult =
  | { ok: true; beneficiaryId: string }
  | { ok: false; reason: AutoMigrationBlockedReason; requiredKeySuffix?: string };

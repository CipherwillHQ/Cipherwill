import { ApolloClient } from "@apollo/client";

export type BackupVersion = "0.0.1" | "0.0.2";

export type RunRestoreArgs = {
  backupFile: File | null;
  setStatus: (status: string) => void;
  client: ApolloClient;
  session: any;
};

export type RestoreStep = "validate" | "load" | "restore" | "finalize";

export type BackupItem = {
  id: string;
  type: string;
  title?: string;
  metadata?: string;
  data?: any;
};

export type LoadedBackupPayload = {
  version: BackupVersion;
  data: BackupItem[];
};

export type RestoreAdapter = {
  version: BackupVersion;
  getMetadata: (item: BackupItem) => string;
  getUploadData: (item: BackupItem) => string;
  getDataModelVersion: (item: BackupItem) => string;
  shouldUploadData?: (item: BackupItem) => boolean;
};

import { ApolloClient } from "@apollo/client";
import { POSSIBLE_STATUS } from "../types";

export type RunBackupArgs = {
  status: string;
  setStatus: (status: POSSIBLE_STATUS) => void;
  setProgress: (progress: number) => void;
  session: any;
  client: ApolloClient;
  setDataPoints: (count: number) => void;
  close: () => void;
};

export type BackupDataCount = {
  count: number;
  publicKey: string[];
};

export type BackupStep =
  | "validate"
  | "collect"
  | "decrypt"
  | "package"
  | "finalize";

export type BackupKey = {
  ref_id: string;
  key: string;
  publicKey?: string;
};

export type BackupModel = {
  id: string;
  type: string;
  metadata: string;
};

export type BackupDataItem = {
  id: string;
  type: string;
  metadata: string;
  data: any;
};

export type ValidationResult = {
  dataCount: BackupDataCount;
  maxPublicKey: string;
};

export type CollectionResult = {
  keysByRef: Record<string, BackupKey>;
  models: BackupModel[];
};

// Defines contracts for checking an existing item during restore.
// Owns explicit clients, decryption sessions, and upload recovery responses.
// Does not fetch records or run backup pipelines.

import type { ApolloClient } from "@apollo/client";

export interface RestoreItemCheck {
  id: string;
  client: ApolloClient;
  session: { publicKey: string; privateKey: string } | null;
}

export interface UploadSessionCommit {
  signal?: AbortSignal;
  client: ApolloClient;
  session_id: string;
}

export interface GetUploadPodSessionQuery {
  getUploadPodSession: {
    id: string;
    status: "CREATED" | "PODS_UPLOADED" | "KEYS_UPLOADED" | "COMPLETED";
    type: "STORAGE_POD" | "TEXT_POD";
    pod_committed: boolean;
  } | null;
}

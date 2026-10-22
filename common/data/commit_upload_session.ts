// Finishes staged key commits for new uploads and restore retries.
// Owns bounded commit attempts and rejects incomplete or failed responses.
// Does not create sessions, stage keys, or replace ciphertext.

import COMMIT_UPLOAD_SESSION from "@/graphql/ops/app/pod/mutations/COMMIT_UPLOAD_SESSION";
import type { UploadSessionCommit } from "@/types/interfaces";

const MAX_COMMIT_ATTEMPTS = 30;

export async function commitSessionUntilCompleted({ client, session_id }: UploadSessionCommit) {
  for (let attempt = 0; attempt < MAX_COMMIT_ATTEMPTS; attempt += 1) {
    const res = await client.mutate({
      mutation: COMMIT_UPLOAD_SESSION,
      variables: { session_id },
    });
    const status = (res.data as any)?.commitUploadSession?.status;
    if (status === "COMPLETED") {
      return;
    }
    if (status !== "KEYS_UPLOADED") {
      throw new Error(`Unexpected upload session status ${String(status)} for ${session_id}`);
    }
  }

  throw new Error(`Commit did not complete after ${MAX_COMMIT_ATTEMPTS} attempts for session ${session_id}`);
}

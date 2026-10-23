// Resumes fully staged uploads and confirms committed ciphertext before retrying.
// Owns upload-session recovery without creating or replacing saved content.
// Does not accept plaintext answers or generate encryption keys.
import type { ApolloClient } from "@apollo/client";
import type { GetPodQuery, GetUploadPodSessionQuery } from "@/types/interfaces";
import GET_UPLOAD_POD_SESSION from "@/graphql/ops/app/pod/queries/GET_UPLOAD_POD_SESSION";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import { commitSessionUntilCompleted } from "@/common/data/commit_upload_session";

export async function resumeGuidedAssetUpload(client: ApolloClient, itemId: string, signal?: AbortSignal) {
  signal?.throwIfAborted();
  const response = await client.query<GetUploadPodSessionQuery>({ query: GET_UPLOAD_POD_SESSION,
    variables: { ref_id: itemId }, fetchPolicy: "no-cache" });
  signal?.throwIfAborted();
  if (!response.data || response.data.getUploadPodSession === undefined) throw new Error("Upload state unavailable");
  const session = response.data.getUploadPodSession;
  if (!session || !["COMPLETED", "KEYS_UPLOADED"].includes(session.status)) return false;
  if (session.status === "KEYS_UPLOADED") {
    if (!session.pod_committed) return false;
    await commitSessionUntilCompleted({ client, session_id: session.id, signal });
    signal?.throwIfAborted();
  }
  const pod = await client.query<GetPodQuery>({ query: GET_POD, variables: { ref_id: itemId }, fetchPolicy: "no-cache" });
  signal?.throwIfAborted();
  if (!pod.data?.getPod?.content) throw new Error("Saved encrypted content unavailable");
  return true;
}

// Checks whether an existing text pod has usable content and a matching key.
// Owns resuming verified key commits and refusing ambiguous saved content.
// Does not replace saved content or treat missing factor keys as data loss.

import CryptoJS from "crypto-js";
import getPod from "@/factory/pod/getPod";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import GET_UPLOAD_POD_SESSION from "@/graphql/ops/app/pod/queries/GET_UPLOAD_POD_SESSION";
import { commitSessionUntilCompleted } from "./commit_upload_session";
import { resolveDecryptionKey } from "@/contexts/PodHelper/helpers";
import type { GetKeyByRefIdQuery, GetUploadPodSessionQuery, RestoreItemCheck } from "@/types/interfaces";

export async function isPodReadable({ id, client, session }: RestoreItemCheck) {
  let content = await getPod(id, client);
  if (!content) {
    return false;
  }

  const response = await client.query<GetUploadPodSessionQuery>({
    query: GET_UPLOAD_POD_SESSION,
    fetchPolicy: "network-only",
    variables: { ref_id: id },
  });
  if (!response.data || response.data.getUploadPodSession === undefined) {
    throw new Error("Unable to verify the existing upload session");
  }
  const uploadSession = response.data.getUploadPodSession;
  if (uploadSession && uploadSession.status !== "COMPLETED") {
    if (uploadSession.status !== "KEYS_UPLOADED" || !uploadSession.pod_committed) {
      throw new Error("This item has an incomplete upload. Finish that upload before restoring.");
    }
    await commitSessionUntilCompleted({ client, session_id: uploadSession.id });
    content = await getPod(id, client);
    if (!content) {
      throw new Error("Unable to read the existing pod after finishing its upload");
    }
  }

  const { data } = await client.query<GetKeyByRefIdQuery>({
    query: GET_KEY_BY_REF_ID,
    fetchPolicy: "network-only",
    variables: { ref_id: id, publicKey: session?.publicKey || "null" },
  });
  const encryptedKey = data?.getKeyByRefId?.key;
  if (!encryptedKey) {
    throw new Error("This authentication factor cannot read the existing item. Switch to its original factor before restoring.");
  }

  try {
    const key = await resolveDecryptionKey(encryptedKey, session);
    const plaintext = CryptoJS.AES.decrypt(content, key).toString(CryptoJS.enc.Utf8);
    if (JSON.parse(plaintext)?.data === undefined) {
      throw new Error("Invalid saved content");
    }
    return true;
  } catch {
    throw new Error("Cannot decrypt the existing item. Its saved content was preserved.");
  }
}

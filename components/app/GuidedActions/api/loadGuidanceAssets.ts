// Loads a small sample of encrypted assets for browser-only personalization.
// Owns relevant asset reads and reuse of the current session's decryption key.
// Does not load the whole vault or retain raw decrypted content.
import type { ApolloClient } from "@apollo/client";
import CryptoJS from "crypto-js";
import type { GetKeyByRefIdQuery, GetMetamodelsQuery, GetMetamodelTypeCountsQuery, GetPodQuery, GuidanceAssets, GuidanceSession } from "@/types/interfaces";
import GET_METAMODEL_TYPE_COUNTS from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL_TYPE_COUNTS";
import GET_METAMODELS from "@/graphql/ops/app/metamodel/queries/GET_METAMODELS";
import GET_POD from "@/graphql/ops/app/pod/queries/GET_POD";
import GET_KEY_BY_REF_ID from "@/graphql/ops/app/key/Queries/GET_KEY_BY_REF_ID";
import { resolveDecryptionKey } from "@/contexts/PodHelper/helpers";
import { getGuidanceAssetLabel } from "../core/assetContext";

export async function loadGuidanceAssets(client: ApolloClient, session: GuidanceSession | null, signal?: AbortSignal): Promise<GuidanceAssets> {
  signal?.throwIfAborted();
  const counts = await client.query<GetMetamodelTypeCountsQuery>({ query: GET_METAMODEL_TYPE_COUNTS, fetchPolicy: "no-cache" });
  signal?.throwIfAborted();
  const total = (counts.data?.getMetamodelTypeCounts ?? []).reduce((sum, item) => sum + item.count, 0);
  for (const type of ["BANK_ACCOUNT", "PAYMENT_CARD", "EMAIL_ACCOUNT"]) {
    if (!counts.data?.getMetamodelTypeCounts.some(item => item.type === type && item.count > 0)) continue;
    const page = await client.query<GetMetamodelsQuery>({ query: GET_METAMODELS, variables: { type }, fetchPolicy: "no-cache" });
    signal?.throwIfAborted();
    for (const model of (page.data?.getMetamodels.models ?? []).slice(0, 3)) {
      try {
        const [pod, encryptedKey] = await Promise.all([
          client.query<GetPodQuery>({ query: GET_POD, variables: { ref_id: model.id }, fetchPolicy: "no-cache" }),
          client.query<GetKeyByRefIdQuery>({ query: GET_KEY_BY_REF_ID,
            variables: { ref_id: model.id, publicKey: session?.publicKey ?? "null" }, fetchPolicy: "no-cache" }),
        ]);
        signal?.throwIfAborted();
        const keyValue = encryptedKey.data?.getKeyByRefId?.key;
        const content = pod.data?.getPod?.content;
        if (!keyValue || !content || (!session && keyValue.startsWith("{"))) continue;
        const key = await resolveDecryptionKey(keyValue, session);
        signal?.throwIfAborted();
        const plaintext = CryptoJS.AES.decrypt(content, key).toString(CryptoJS.enc.Utf8);
        const label = getGuidanceAssetLabel(plaintext, type);
        if (label) return { total, label };
      } catch {
        signal?.throwIfAborted();
        // A different encryption factor may be needed for this asset.
      }
    }
  }
  return { total, label: null };
}

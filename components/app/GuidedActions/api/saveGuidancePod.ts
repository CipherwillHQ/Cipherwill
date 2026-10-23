// Saves guided text or file pods through the existing encrypted upload pipeline.
// Owns stable identity, staged-upload retries, and vault list invalidation.
// Does not interpret answers or send plaintext contents in metadata.
import type { ApolloClient } from "@apollo/client";
import type { CreateMetamodelMutation, GuidancePodUpload, GuidanceSession } from "@/types/interfaces";
import CREATE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import uploadPodData from "@/common/data/upload_pod_data";
import { resumeGuidedAssetUpload } from "./resumeAssetUpload";

export async function saveGuidancePod(client: ApolloClient, session: GuidanceSession | null,
  item: GuidancePodUpload, signal?: AbortSignal) {
  signal?.throwIfAborted();
  if (typeof item.itemId !== "string" || !/^[\w-]{6,100}$/.test(item.itemId)) throw new Error("Invalid item ID");
  if (!await resumeGuidedAssetUpload(client, item.itemId, signal)) {
    signal?.throwIfAborted();
    const response = await client.mutate<CreateMetamodelMutation>({ mutation: CREATE_METAMODEL,
      variables: { id: item.itemId, type: item.type, metadata: JSON.stringify(item.metadata) } });
    signal?.throwIfAborted();
    if (response.data?.createMetamodel.id !== item.itemId) throw new Error("Unable to create guided item");
    await uploadPodData({ client, signal, metamodel_id: item.itemId, data_items: [{ ref_id: item.itemId,
      data_model_version: item.version, publicKey: session?.publicKey, data: item.data }] });
  }
  signal?.throwIfAborted();
  client.cache.evict({ id: "ROOT_QUERY", fieldName: "getMetamodels" });
  client.cache.evict({ id: "ROOT_QUERY", fieldName: "getMetamodelTypeCounts" });
  return { itemId: item.itemId };
}

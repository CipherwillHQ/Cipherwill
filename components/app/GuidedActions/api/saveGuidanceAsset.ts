// Saves guided asset answers through the established encrypted upload pipeline.
// Owns retry identity, staged-upload recovery, and vault list invalidation.
// Does not send account numbers, note content, or passwords as mutation fields.
import type { ApolloClient } from "@apollo/client";
import type { CreateMetamodelMutation, GuidanceSession, GuidanceAssetSchema } from "@/types/interfaces";
import CREATE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import uploadPodData from "@/common/data/upload_pod_data";
import { buildGuidedAssetInput } from "../core/assetInputSchema";
import { resumeGuidedAssetUpload } from "./resumeAssetUpload";

export async function saveGuidanceAsset(client: ApolloClient, session: GuidanceSession | null,
  args: Record<string, unknown>, signal?: AbortSignal) {
  signal?.throwIfAborted();
  if (!args.schema || typeof args.schema !== "object") throw new Error("Missing asset schema");
  const item = buildGuidedAssetInput(args, args.schema as GuidanceAssetSchema);
  if (!await resumeGuidedAssetUpload(client, item.itemId, signal)) {
    signal?.throwIfAborted();
    const response = await client.mutate<CreateMetamodelMutation>({ mutation: CREATE_METAMODEL,
      variables: { id: item.itemId, type: item.type, metadata: JSON.stringify(item.metadata) } });
    signal?.throwIfAborted();
    if (response.data?.createMetamodel.id !== item.itemId) throw new Error("Unable to create guided item");
    await uploadPodData({ client, signal, metamodel_id: item.itemId, data_items: [{ ref_id: item.itemId,
      data_model_version: item.pod.version, publicKey: session?.publicKey, data: JSON.stringify(item.pod) }] });
  }
  signal?.throwIfAborted();
  client.cache.evict({ id: "ROOT_QUERY", fieldName: "getMetamodels" });
  client.cache.evict({ id: "ROOT_QUERY", fieldName: "getMetamodelTypeCounts" });
  return { itemId: item.itemId };
}

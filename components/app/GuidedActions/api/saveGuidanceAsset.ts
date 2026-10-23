// Saves guided asset answers through the established encrypted upload pipeline.
// Owns retry identity, staged-upload recovery, and vault list invalidation.
// Does not send account numbers, note content, or passwords as mutation fields.
import type { ApolloClient } from "@apollo/client";
import type { GuidanceSession, GuidanceAssetSchema } from "@/types/interfaces";
import { buildGuidedAssetInput } from "../core/assetInputSchema";
import { saveGuidancePod } from "./saveGuidancePod";

export async function saveGuidanceAsset(client: ApolloClient, session: GuidanceSession | null,
  args: Record<string, unknown>, signal?: AbortSignal) {
  signal?.throwIfAborted();
  if (!args.schema || typeof args.schema !== "object") throw new Error("Missing asset schema");
  const item = buildGuidedAssetInput(args, args.schema as GuidanceAssetSchema);
  return saveGuidancePod(client, session, { ...item, version: item.pod.version, data: JSON.stringify(item.pod) }, signal);
}

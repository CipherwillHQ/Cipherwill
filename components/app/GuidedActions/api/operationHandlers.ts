// Binds catalog operation names and context names to trusted browser services.
// Owns the extension points for new browser capabilities.
// Does not register objectives or accept executable code from the catalog.
import type { ApolloClient } from "@apollo/client";
import type { GuidancePerson, GuidanceSession } from "@/types/interfaces";
import SEARCH_PERSON from "@/graphql/ops/app/people/queries/SEARCH_PERSON";
import { loadGuidanceAssets } from "./loadGuidanceAssets";
import { migrateGuidedBeneficiary } from "../core/objectiveActionRunner";
import { saveGuidanceAsset } from "./saveGuidanceAsset";
import { saveGuidanceFile } from "./saveGuidanceFile";
import { GET_GUIDED_ASSET_COUNTS } from "./completionQueries";
import { supportsGuidanceDefinition } from "../core/guidanceCapabilities";
import type { GuidanceDefinition } from "@/types/interfaces";

export function createOperationHandlers(client: ApolloClient, session: GuidanceSession | null) {
  const operations: Record<string, (args: Record<string, unknown>, signal?: AbortSignal) => Promise<unknown>> = {
    create_item_id: async () => `guided_${crypto.randomUUID()}`,
    save_encrypted_asset: (args, signal) => saveGuidanceAsset(client, session, args, signal),
    save_encrypted_file: (args, signal) => saveGuidanceFile(client, session, args, signal),
    lookup_person: async ({ email }) => {
      const response = await client.query<{ searchPerson: GuidancePerson[] }>({
        query: SEARCH_PERSON, variables: { email }, fetchPolicy: "no-cache",
      });
      return response.data?.searchPerson.find(person => person.__typename === "User") ?? null;
    },
    migrate_beneficiary: async ({ personId }, signal) => {
      if (typeof personId !== "string") throw new Error("Missing beneficiary ID");
      await migrateGuidedBeneficiary(personId, { client, session }, signal);
    },
  };
  const contexts: Record<string, (signal: AbortSignal) => Promise<unknown>> = {
    savedAssets: async (signal) => {
      const response = await client.query<{ getGuidedAssetCounts: Record<string, number> }>({
        query: GET_GUIDED_ASSET_COUNTS, fetchPolicy: "no-cache",
      });
      signal.throwIfAborted();
      if (!response.data?.getGuidedAssetCounts) throw new Error("Saved item counts unavailable");
      return response.data.getGuidedAssetCounts;
    },
    assets: async (signal) => {
      try { return await loadGuidanceAssets(client, session, signal); }
      catch { signal.throwIfAborted(); return { total: 0, label: null }; }
    },
  };
  return {
    supportsDefinition: (flow: GuidanceDefinition) => supportsGuidanceDefinition(flow, Object.keys(operations), Object.keys(contexts)),
    runOperation: (type: string, args: Record<string, unknown>, signal?: AbortSignal) => {
      signal?.throwIfAborted();
      if (!Object.hasOwn(operations, type)) throw new Error("Unsupported guidance operation");
      return operations[type](args, signal);
    },
    loadContext: (name: string, signal: AbortSignal) => {
      if (!Object.hasOwn(contexts, name)) throw new Error("Unsupported guidance context");
      return contexts[name](signal);
    },
  };
}

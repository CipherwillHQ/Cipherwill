// Connects local guidance to account reads, explicit saves, and migration.
// Owns the narrow network boundary and server-derived beneficiary lookup.
// Does not serialize conversation state or decrypted asset context.
import type { ApolloClient } from "@apollo/client";
import type { GuidanceCompletion, GuidanceServices, GuidanceSession, GuidanceDeferral } from "@/types/interfaces";
import ME from "@/graphql/ops/auth/queries/ME";
import GET_SMARTWILL_BENEFICIARY from "@/graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import { COMPLETE_GUIDED_OBJECTIVE, DEFER_GUIDED_OBJECTIVE, RESUME_GUIDED_OBJECTIVE, FINISH_GUIDED_OPERATION } from "./completionQueries";
import GET_PREFERENCES from "@/graphql/ops/auth/queries/GET_PREFERENCES";
import { createOperationHandlers } from "./operationHandlers";
import { InitialGuidance } from "./initialGuidance";

export function createGuidanceServices(client: ApolloClient, session: GuidanceSession | null): GuidanceServices {
  const initial = new InitialGuidance(client);
  return {
    ...createOperationHandlers(client, session),
    loadCatalog: async (refresh) => {
      const response = await initial.load(refresh);
      if (!Array.isArray(response.data?.getGuidedObjectiveCatalog)) throw new Error("Catalog unavailable");
      return response.data.getGuidedObjectiveCatalog;
    },
    loadAccount: async (refresh) => {
      const response = await initial.load(refresh);
      if (!response.data?.me || !response.data.getPreferences || !Array.isArray(response.data.getGuidedActionDeferrals)
        || !Array.isArray(response.data.getGuidedActionCompletions)) throw new Error("Account unavailable");
      return { firstName: response.data.me.first_name, lastName: response.data.me.last_name,
        birthDate: response.data.me.birth_date, beneficiaryCount: response.data.getSmartWillBeneficiaries.length,
        completedObjectiveIds: response.data.getGuidedActionCompletions,
        deferrals: response.data.getGuidedActionDeferrals, recovery: response.data.getGuidedActionRecovery ?? [],
        preferences: response.data.getPreferences, plan: response.data.me.plan };
    },
    completeObjective: async (objectiveId, answers, version) => {
      const response = await client.mutate<{ completeGuidedObjective: GuidanceCompletion }>({
        mutation: COMPLETE_GUIDED_OBJECTIVE, variables: { objectiveId, answers, ...(version !== undefined && { version }) },
        refetchQueries: [ME, GET_SMARTWILL_BENEFICIARY, GET_PREFERENCES],
      });
      if (!response.data?.completeGuidedObjective) throw new Error("Save unavailable");
      return response.data.completeGuidedObjective;
    },
    finishOperation: async (objectiveId, actionId) => {
      const response = await client.mutate<{ finishGuidedActionOperation: boolean }>({
        mutation: FINISH_GUIDED_OPERATION, variables: { objectiveId, actionId },
      });
      if (response.data?.finishGuidedActionOperation !== true) throw new Error("Operation acknowledgement unavailable");
    },
    deferObjective: async (objectiveId, dismiss) => {
      const response = await client.mutate<{ deferGuidedAction: GuidanceDeferral }>({
        mutation: DEFER_GUIDED_OBJECTIVE, variables: { objectiveId, dismiss },
      });
      if (!response.data?.deferGuidedAction) throw new Error("Deferral unavailable");
      return response.data.deferGuidedAction;
    },
    resumeObjective: async (objectiveId) => {
      const response = await client.mutate<{ resumeGuidedAction: boolean }>({
        mutation: RESUME_GUIDED_OBJECTIVE, variables: { objectiveId },
      });
      if (response.data?.resumeGuidedAction !== true) throw new Error("Resume unavailable");
    },
  };
}

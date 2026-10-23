// Exposes the generated guidance protocol and browser-only runtime state.
// Owns scope, flow state, and the initial account response.
// Does not maintain a second protocol or register objectives.
import type { GuidanceAccount, GuidanceAnswers } from "./guidedActions";
import type { GuidanceDefinition, GuidanceCompletion, GuidanceRecovery } from "./guidanceContract";
import type { GetPreferencesQuery } from "./metamodel";
import type { GuidanceDeferral } from "./guidanceChoices";
export * from "./guidanceContract";
export interface GuidanceScope {
  account: GuidanceAccount; answers: GuidanceAnswers; effects: Record<string, unknown>;
  context: Record<string, unknown>; completion: GuidanceCompletion | null;
}
export interface GuidanceFlowState {
  answers: GuidanceAnswers; effects: Record<string, unknown>; visited: Set<string>;
  completion: GuidanceCompletion | null; finishedActions: Set<string>; executedActions: Set<string>;
}
export interface GuidanceBootstrapData {
  getGuidedObjectiveCatalog: GuidanceDefinition[];
  getGuidedActionCompletions: string[];
  getGuidedActionDeferrals: GuidanceDeferral[];
  getGuidedActionRecovery: GuidanceRecovery[];
  getPreferences: GetPreferencesQuery["getPreferences"];
  me: { first_name: string | null; last_name: string | null; birth_date: string | null; plan: string };
  getSmartWillBeneficiaries: Array<{ id: string }>;
}

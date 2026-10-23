// Defines the account overview data and display contracts for guided setup.
// Owns count-only responses, profile milestones, and overview component props.
// Does not include asset content, factor keys, or conversation drafts.
import type { DeferredGuidanceProps } from "./guidanceChoices";
export interface GuidanceOverviewData {
  getUserScore: string;
  me: { first_name: string | null };
  getMetamodelTypeCounts: Array<{ type: string; count: number }>;
  getSmartWillBeneficiaries: Array<{ id: string }>;
  getFactors: Array<{ id: string }>;
}
export interface GuidanceOverview {
  firstName: string | null;
  score: number;
  itemCount: number;
  beneficiaryCount: number;
  factorCount: number;
}
export interface GuidanceOverviewProps extends DeferredGuidanceProps {
  overview: GuidanceOverview | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onStart: () => void;
  setupLoading: boolean;
  setupAvailable: boolean;
  setupError: boolean;
}

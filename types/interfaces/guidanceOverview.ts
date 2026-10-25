// Defines the account overview data and display contracts for guided setup.
// Owns count-only responses, profile milestones, and overview component props.
// Does not include asset content, factor keys, or conversation drafts.
import type { DeferredGuidanceProps } from "./guidanceChoices";
import type { MetamodelTypeCount } from "./metamodel";
export interface GuidanceOverviewData {
  getUserScore: string;
  me: { first_name: string | null; email_verified: boolean };
  getMetamodelTypeCounts: MetamodelTypeCount[];
  getSmartWillBeneficiaries: Array<{ id: string }>;
  getFactors: Array<{ id: string }>;
}
export interface GuidanceOverview {
  firstName: string | null;
  emailVerified: boolean;
  score: number;
  itemCount: number;
  typeCounts: MetamodelTypeCount[];
  beneficiaryCount: number;
  factorCount: number;
}
export interface DataRecordsMetricProps {
  count: number;
  typeCounts: MetamodelTypeCount[];
}
export interface GuidanceOverviewProps extends DeferredGuidanceProps {
  overview: GuidanceOverview | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onStart: () => void;
  onVerifyEmail: () => void;
  setupLoading: boolean;
  setupAvailable: boolean;
  setupError: boolean;
}

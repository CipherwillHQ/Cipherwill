// Loads a fresh account overview whenever its slide is shown.
// Owns query loading, retry, and conversion to display-only account metrics.
// Does not retain decrypted context or mutate account records.
import { useQuery } from "@apollo/client/react";
import type { GuidanceOverview, GuidanceOverviewData } from "@/types/interfaces";
import { GET_GUIDANCE_OVERVIEW } from "../api/overviewQuery";
import { buildGuidanceOverview } from "../core/accountOverview";

export default function useGuidanceOverview() {
  const { data, loading, error, refetch } = useQuery<GuidanceOverviewData>(GET_GUIDANCE_OVERVIEW, { fetchPolicy: "no-cache" });
  let overview: GuidanceOverview | null = null;
  let invalid = false;
  if (data && !loading && !error) {
    try { overview = buildGuidanceOverview(data); }
    catch { invalid = true; }
  }
  return { overview, loading, error: Boolean(error) || invalid || (!loading && !data),
    onRetry: () => { void refetch().catch(() => {}); } };
}

// Loads fresh metrics for each visit to the overview slide.
// Owns the query-to-presentation binding for GuideOverview.
// Does not unmount or reset the active browser guidance engine.
import type { GuidanceOverviewProps } from "@/types/interfaces";
import useGuidanceOverview from "../hooks/useGuidanceOverview";
import GuideOverview from "./GuideOverview";

export default function GuideOverviewSlide(props: Pick<GuidanceOverviewProps, "onStart" | "setupLoading" | "setupAvailable" | "setupError" | "deferred" | "onResume">) {
  const overview = useGuidanceOverview();
  return <GuideOverview {...overview} {...props} />;
}

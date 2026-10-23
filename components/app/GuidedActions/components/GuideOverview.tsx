// Presents the account overview as the guide's opening and return slide.
// Owns a centered account summary with small metric pills and the setup button.
// Does not select objectives or expose saved asset contents.
import type { GuidanceOverviewProps } from "@/types/interfaces";
import GuidedButton from "./GuidedButton";
import OverviewMetric from "./OverviewMetric";
import DeferredGuidance from "./DeferredGuidance";

export default function GuideOverview(props: GuidanceOverviewProps) {
  const { overview, loading, error, onRetry, onStart, setupLoading, setupAvailable, setupError } = props;
  if (loading) return <div className="flex flex-1 items-center justify-center p-10" role="status">Preparing your account overview…</div>;
  if (error || !overview) return <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
    <p role="alert">We couldn't load your account overview.</p><GuidedButton onClick={onRetry}>Retry</GuidedButton>
  </div>;
  return <section aria-label="Account overview" className="flex flex-1 flex-col px-5 py-8 md:px-10 md:py-12">
    <div className="flex min-h-96 flex-1 flex-col items-center justify-center text-center">
      <div className="flex w-full max-w-4xl min-h-72 md:min-h-88 flex-col items-center justify-center gap-7">
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">Your Cipherwill Status</h1>
        <p className="max-w-2xl text-base md:text-xl text-black/70 dark:text-white/70 leading-relaxed">
          {overview.firstName ? `${overview.firstName}, here's where your Cipherwill stands.` : "Here's where your Cipherwill stands."}
          {" "}Continue your setup, one step at a time.
        </p>
        <nav aria-label="Account status" className="flex max-w-2xl flex-wrap justify-center gap-2">
          <OverviewMetric count={overview.score} label="Score" suffix="/ 950" href="/app/score" />
          <OverviewMetric count={overview.itemCount} label="Data records" href="/app/segments" />
          <OverviewMetric count={overview.beneficiaryCount} label="Beneficiaries" href="/app/beneficiaries" />
          <OverviewMetric count={overview.factorCount} label="Security factors" href="/app/factors" />
          <DeferredGuidance deferred={props.deferred} onResume={props.onResume} loading={setupLoading} />
        </nav>
        {(setupLoading || setupAvailable || setupError) && <GuidedButton onClick={onStart} disabled={setupLoading}>
          {setupLoading ? "Preparing setup…" : "Continue Cipherwill Setup"}
        </GuidedButton>}
        {(setupError || (!setupLoading && !setupAvailable && props.deferred.length > 0)) && <p className="max-w-lg text-sm text-black/60 dark:text-white/60" role="status">
          {setupError ? "Setup couldn't load. Continue to retry."
            : "You have tasks in Do later. Resume them whenever you're ready."}
        </p>}
      </div>
    </div>
  </section>;
}

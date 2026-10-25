// Presents the account overview as the guide's opening and return slide.
// Owns a centered account summary, reusable banner area, and setup button.
// Does not select objectives or expose saved asset contents.
import type { GuidanceOverviewProps } from "@/types/interfaces";
import GuidedButton from "./GuidedButton";
import OverviewMetric from "./OverviewMetric";
import DeferredGuidance from "./DeferredGuidance";
import BannerArea from "@/components/app/common/BannerArea";
import EmailVerificationBanner from "./EmailVerificationBanner";
import DataRecordsMetric from "./DataRecordsMetric";
import { LayoutGroup, motion, MotionConfig } from "framer-motion";

export default function GuideOverview(props: GuidanceOverviewProps) {
  const { overview, loading, error, onRetry, onStart, setupLoading, setupAvailable, setupError } = props;
  if (loading) return <div className="flex flex-1 items-center justify-center p-10" role="status">Preparing your account overview…</div>;
  if (error || !overview) return <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
    <p role="alert">We couldn't load your account overview.</p><GuidedButton onClick={onRetry}>Retry</GuidedButton>
  </div>;
  return <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: "easeOut" }}><LayoutGroup>
  <section aria-label="Account overview" className="flex flex-1 flex-col px-5 py-8 md:px-10 md:py-12">
    <div className="flex min-h-96 flex-1 flex-col items-center justify-center text-center">
      <motion.div layout="position" className="flex w-full max-w-4xl min-h-72 md:min-h-88 flex-col items-center justify-center gap-7">
        <motion.h1 layout="position" className="text-3xl md:text-5xl font-semibold leading-tight">Your Cipherwill Status</motion.h1>
        <motion.p layout="position" className="max-w-2xl text-base md:text-xl text-black/70 dark:text-white/70 leading-relaxed">
          {overview.firstName ? `${overview.firstName}, here's where your Cipherwill stands.` : "Here's where your Cipherwill stands."}
          {" "}Continue your setup, one step at a time.
        </motion.p>
        <motion.nav layout="position" aria-label="Account status" className="flex max-w-2xl flex-wrap justify-center gap-2 items-end">
          <motion.div layout="position"><OverviewMetric count={overview.score} label="Score" suffix="/ 950" href="/app/score" /></motion.div>
          <DataRecordsMetric count={overview.itemCount} typeCounts={overview.typeCounts} />
          <motion.div layout="position"><OverviewMetric count={overview.beneficiaryCount} label="Beneficiaries" href="/app/beneficiaries" /></motion.div>
          <motion.div layout="position"><OverviewMetric count={overview.factorCount} label="Security factors" href="/app/factors" /></motion.div>
          {props.deferred.length > 0 && <motion.div layout="position"><DeferredGuidance deferred={props.deferred} onResume={props.onResume} loading={setupLoading} /></motion.div>}
        </motion.nav>
        {!overview.emailVerified && <motion.div layout="position" className="w-full max-w-2xl"><BannerArea>
          <EmailVerificationBanner onVerifyEmail={props.onVerifyEmail} />
        </BannerArea></motion.div>}
        {(setupLoading || setupAvailable || setupError) && <motion.div layout="position"><GuidedButton onClick={onStart} disabled={setupLoading}>
          {setupLoading ? "Preparing setup…" : "Continue Cipherwill Setup"}
        </GuidedButton></motion.div>}
        {(setupError || (!setupLoading && !setupAvailable && props.deferred.length > 0)) && <motion.p layout="position" className="max-w-lg text-sm text-black/60 dark:text-white/60" role="status">
          {setupError ? "Setup couldn't load. Continue to retry."
            : "You have tasks in Do later. Resume them whenever you're ready."}
        </motion.p>}
      </motion.div>
    </div>
  </section></LayoutGroup></MotionConfig>;
}

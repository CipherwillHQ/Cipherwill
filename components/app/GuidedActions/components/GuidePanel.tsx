// Displays one objective slide inside the guide's full content area.
// Owns animated steps, return-to-overview controls, and progress/status footers.
// Does not process questions or persist conversation state.
import { AnimatePresence, motion } from "framer-motion";
import type { GuidancePanelProps } from "@/types/interfaces";
import GuidePanelBody from "./GuidePanelBody";
import { PostActionFooter, ProgressFooter, TimedCountdownFooter } from "./GuidePanelFooters";
import useGuidePanelState from "../hooks/useGuidePanelState";
import GuideExitControls from "./GuideExitControls";

export default function GuidePanel(props: GuidancePanelProps) {
  const state = useGuidePanelState(props);
  const { current, error, postActionStatus } = props;
  const canShowProgress = !error && Boolean(current);
  return <section aria-label={current?.result.objectiveTitle ?? "Guided setup"}
    className="flex flex-1 flex-col px-5 py-8 md:px-10 md:py-12">
    <div className="flex min-h-96 flex-1 flex-col items-center justify-center text-center">
      <motion.div layout transition={{ layout: { duration: 0.24, ease: "easeOut" } }}
        className="w-full max-w-4xl min-h-72 md:min-h-88 flex flex-col items-center justify-center">
        <AnimatePresence initial={false} mode="wait"><GuidePanelBody key={state.contentStateKey} props={props} state={state} /></AnimatePresence>
      </motion.div>
    </div>
    <footer className="mt-6 flex min-h-16 flex-col items-center justify-end gap-3">
      {state.viewState !== "empty" && <GuideExitControls {...props} />}
      {canShowProgress && current && <ProgressFooter current={current} />}
      {canShowProgress && state.isTimedDisplayStep && !postActionStatus && <TimedCountdownFooter countdownSeconds={state.countdownSeconds} />}
      {canShowProgress && postActionStatus && <PostActionFooter postActionStatus={postActionStatus} />}
    </footer>
  </section>;
}

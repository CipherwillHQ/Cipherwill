// Loads fresh metrics for each visit to the overview slide.
// Owns overview data and independent email verification transitions.
// Does not unmount or reset the active browser guidance engine.
import type { GuidanceOverviewProps } from "@/types/interfaces";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useGuidanceOverview from "../hooks/useGuidanceOverview";
import useEmailVerification from "../hooks/useEmailVerification";
import GuideOverview from "./GuideOverview";
import EmailVerificationSlide from "./EmailVerificationSlide";

export default function GuideOverviewSlide(props: Pick<GuidanceOverviewProps, "onStart" | "setupLoading" | "setupAvailable" | "setupError" | "deferred" | "onResume">) {
  const overview = useGuidanceOverview();
  const { onRetry } = overview;
  const [verifying, setVerifying] = useState(false);
  const finishVerification = useCallback(() => {
    onRetry();
    setVerifying(false);
  }, [onRetry]);
  const verification = useEmailVerification(finishVerification);
  const openVerification = useCallback(() => setVerifying(true), []);
  const closeVerification = useCallback(() => setVerifying(false), []);
  return <AnimatePresence initial={false} mode="wait">
    <motion.div key={verifying ? `verification-${verification.sent ? "check" : "send"}` : "overview"}
      initial={{ opacity: 0, x: 70 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -70 }}
      transition={{ duration: 0.28, ease: "easeOut" }} className="flex flex-1 flex-col">
      {verifying ? <EmailVerificationSlide {...verification} onClose={closeVerification} />
        : <GuideOverview {...overview} {...props} onVerifyEmail={openVerification} />}
    </motion.div>
  </AnimatePresence>;
}

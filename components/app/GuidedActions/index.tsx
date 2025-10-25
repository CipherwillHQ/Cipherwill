"use client";

import SimpleButton from "@/components/common/SimpleButton";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import GuidePanel from "./GuidePanel";

export default function GuidedActions() {
  const [showGuidedActions, setShowGuidedActions] = useState(false);

  useEffect(() => {
    if (showGuidedActions) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showGuidedActions]);

  return (
    <div className="w-full border border-default bg-secondary p-4 rounded-lg flex items-center justify-between mb-2">
      Start guided actions
      <SimpleButton onClick={() => setShowGuidedActions(true)}>
        Start Now
      </SimpleButton>
      <AnimatePresence>
        {showGuidedActions && <GuidePanel setShowGuidedActions={setShowGuidedActions} />}
      </AnimatePresence>
    </div>
  );
}

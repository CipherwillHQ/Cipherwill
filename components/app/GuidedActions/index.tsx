"use client";

import SimpleButton from "@/components/common/SimpleButton";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import GuidePanel from "./GuidePanel";

export default function GuidedActions() {
  const [showGuidedActions, setShowGuidedActions] = useState(false);
  const [actions, setActions] = useState([
    {
      id: "6",
      action: "A note for us",
      inputType: "textarea",
      description: "Your feedback is valuable to us.",
      introText: "One more thing! We'd appreciate any feedback you have.",
      introTextTimeout: 2000,
      skippable: true,
    },
    {
      id: "7",
      action: "Select your preferred notification method",
      inputType: "single-choice",
      choices: ["Email", "SMS", "Push Notifications", "None"],
      description: "This helps us keep you informed in the way you prefer.",
      introText:
        "Before we finish, let's set up your notification preferences.",
      introTextTimeout: 2000,
      skippable: true,
    },
    {
      id: "1",
      action: "What's your birthday?",
      inputType: "date",
      description:
        "This lets us personalize your experience based on your age.",
      introText: null,
      introTextTimeout: 2000,
      skippable: true,
    },
    {
      id: "2",
      action: "Do you want to enable dark mode?",
      inputType: "boolean",
      description: "Dark mode is easier on the eyes in low-light environments.",
      introText: "Next, let's set your theme preference.",
      introTextTimeout: 2000,
      skippable: false,
    },
  ]);

  const loadMoreActions = () => {
    // Placeholder: load more actions, for now add some dummy ones
    setActions((prev) => [
      {
        id: "extra1",
        action: "Extra question: What's your favorite color?",
        inputType: "text",
        description: "Just for fun!",
        introText: "Here's an extra question.",
        introTextTimeout: 2000,
        skippable: true,
      },
      {
        id: "3",
        action: "Choose your favorite categories",
        inputType: "multiple-choice",
        choices: ["Technology", "Health", "Finance", "Entertainment", "Sports"],
        description: "This helps us recommend content you'll love.",
        introText: "Finally, let's pick some categories you like.",
        introTextTimeout: 2000,
        skippable: true,
      },
      {
        id: "4",
        action: "How many hours do you work per week?",
        inputType: "number",
        description: "This helps us tailor productivity tips for you.",
        introText: "Almost done! Just a quick question about your work hours.",
        introTextTimeout: 2000,
        skippable: false,
      },
      {
        id: "5",
        action: "Any additional comments or preferences?",
        inputType: "text",
        description:
          "Feel free to share anything else that can help us improve your experience.",
        introText: "Last one! We'd love to hear any extra thoughts you have.",
        introTextTimeout: 2000,
        skippable: true,
      },
    ]);
    return true;
    // setActions([])
    // return false; // No actions added
  };

  useEffect(() => {
    if (showGuidedActions) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showGuidedActions]);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="w-full border border-default bg-secondary p-4 rounded-lg flex items-center justify-between mb-2">
      Start guided actions
      <SimpleButton onClick={() => setShowGuidedActions(true)}>
        Start Now
      </SimpleButton>
      <AnimatePresence>
        {showGuidedActions && (
          <GuidePanel
            setShowGuidedActions={setShowGuidedActions}
            actions={actions}
            onLoadMoreActions={loadMoreActions}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

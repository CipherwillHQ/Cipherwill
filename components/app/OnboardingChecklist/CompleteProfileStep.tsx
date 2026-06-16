/**
 * OnboardingChecklist/CompleteProfileStep.tsx
 * What it does: Renders the "Complete Profile" checklist step with its link, icons, and descriptions.
 * What it owns: The presentation and interaction states for the Profile step in the onboarding list.
 * What it does NOT do: Does not fetch profile or user context state directly (provided as props from the parent).
 */

"use client";

import Link from "next/link";
import { BiCheckCircle, BiCircle } from "react-icons/bi";

interface CompleteProfileStepProps {
  isComplete: boolean;
}

export default function CompleteProfileStep({ isComplete }: CompleteProfileStepProps) {
  return (
    <Link
      href="/app/settings?tab=profile"
      className={`group flex items-start gap-3 p-3 rounded-xl border border-default transition-all duration-200 bg-gray-50/50 dark:bg-darkAccent/10 ${
        isComplete
          ? "pointer-events-none opacity-60 border-transparent bg-transparent"
          : "hover:bg-gray-100/50 dark:hover:bg-darkAccent/30 hover:border-primary/20"
      }`}
    >
      <div className="mt-0.5 flex-shrink-0">
        {isComplete ? (
          <BiCheckCircle className="text-sage" size={20} />
        ) : (
          <BiCircle className="text-primary group-hover:scale-110 transition-transform duration-200" size={20} />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span
          className={`font-semibold text-sm transition-colors duration-200 ${
            isComplete
              ? "text-gray-400 dark:text-gray-500 line-through"
              : "text-gray-800 dark:text-gray-200 group-hover:text-primary"
          }`}
        >
          Add profile info
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
          Generates your schedule for automated will execution events.
        </span>
      </div>
    </Link>
  );
}

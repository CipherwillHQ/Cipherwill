/**
 * OnboardingChecklist/CompleteNoteCreationStep.tsx
 * What it does: Renders the "Add a Note" checklist step with its link, icons, and descriptions.
 * What it owns: The presentation and interaction states for the Note Creation step in the onboarding list.
 * What it does NOT do: Does not fetch note or metamodel state directly (provided as props from the parent).
 */

"use client";

import Link from "next/link";
import { BiCheckCircle, BiCircle } from "react-icons/bi";

interface CompleteNoteCreationStepProps {
  isComplete: boolean;
}

export default function CompleteNoteCreationStep({ isComplete }: CompleteNoteCreationStepProps) {
  return (
    <Link
      href="/app/data/notes"
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
          Add a note
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
          Save and secure a sample note to understand the system.
        </span>
      </div>
    </Link>
  );
}

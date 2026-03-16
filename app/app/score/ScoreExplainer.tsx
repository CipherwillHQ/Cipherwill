"use client";

import SimpleButton from "@/components/common/SimpleButton";
import GET_USER_SCORE from "@/graphql/ops/app/score/queries/GET_USER_SCORE";
import { GetUserScoreData } from "@/types";
import { useQuery } from "@apollo/client/react";
import { twMerge } from "tailwind-merge";

interface ScoreItemProps {
  description: string;
  value: number;
  pointsLabel: string;
  actionHref?: string;
  actionLabel?: string;
  noAction?: boolean;
}

function ScoreItem({
  description,
  value,
  pointsLabel,
  actionHref,
  actionLabel,
  noAction,
}: ScoreItemProps) {
  const isComplete = value !== 0;

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-default bg-secondary/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
            {pointsLabel}
          </span>
          <span
            className={twMerge(
              "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
              isComplete
                ? "bg-green-500/15 text-green-600 dark:text-green-400"
                : "bg-neutral-500/15 text-neutral-600 dark:text-neutral-300",
            )}
          >
            {isComplete ? "Completed" : "Pending"}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
          {description}
        </p>
      </div>

      {noAction ? null : isComplete ? (
        <svg
          className="h-5 w-5 shrink-0 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <SimpleButton className="w-full sm:w-auto" href={actionHref}>
          {actionLabel}
        </SimpleButton>
      )}
    </li>
  );
}

export default function ScoreExplainer() {
  const { data, loading, error } = useQuery<GetUserScoreData>(GET_USER_SCORE);

  if (loading) return null;
  if (error) {
    return (
      <div className="rounded-2xl border border-default bg-secondary p-5">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load score explanation.
        </p>
      </div>
    );
  }

  const scoreDetails = data ? JSON.parse(data.getUserScore) : {};

  const items = [
    {
      description: `${scoreDetails.base ?? 300} points are included as your base score.`,
      value: 1,
      pointsLabel: "Base",
      noAction: true,
    },
    {
      description: "Add your first name to unlock profile completion points.",
      value: scoreDetails.firstName,
      pointsLabel: "+100",
      actionHref: "/app/settings?tab=profile",
      actionLabel: "Add",
    },
    {
      description: "Add your last name to improve identity completeness.",
      value: scoreDetails.lastName,
      pointsLabel: "+100",
      actionHref: "/app/settings?tab=profile",
      actionLabel: "Add",
    },
    {
      description: "Add your date of birth to complete your personal profile.",
      value: scoreDetails.dateOfBirth,
      pointsLabel: "+100",
      actionHref: "/app/settings?tab=profile",
      actionLabel: "Add",
    },
    {
      description: "Add at least one secure data item (note, account, email, password, etc.).",
      value: scoreDetails.metamodel,
      pointsLabel: "+100",
      actionHref: "/app/data/notes",
      actionLabel: "Add",
    },
    {
      description: "Add at least one beneficiary to improve transfer readiness.",
      value: scoreDetails.beneficiary,
      pointsLabel: "+100",
      actionHref: "/app/beneficiaries",
      actionLabel: "Add",
    },
    {
      description: "Open Cipherwill at least 3 times within the last 1 year.",
      value: scoreDetails.sessions,
      pointsLabel: "+100",
      noAction: true,
    },
    {
      description: "Upgrade to Cipherwill Premium to unlock subscription points.",
      value: scoreDetails.premium,
      pointsLabel: "+50",
      actionHref: "/app/billing",
      actionLabel: "Upgrade",
    },
  ];

  const completedCount = items.filter((item) => item.value !== 0).length;

  return (
    <div className="rounded-2xl border border-default bg-secondary p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-default pb-4">
        <div>
          <h2 className="text-xl font-semibold">How your score is calculated</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Complete these milestones to increase your Cipherwill Score.
          </p>
        </div>
        <span className="inline-flex rounded-full border border-default px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">
          {completedCount}/{items.length} completed
        </span>
      </div>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <ScoreItem key={index} {...item} />
        ))}
      </ul>
    </div>
  );
}

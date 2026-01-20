"use client";
import SimpleButton from "@/components/common/SimpleButton";
import GET_USER_SCORE from "@/graphql/ops/app/score/queries/GET_USER_SCORE";
import { GetUserScoreData } from "@/types";
import { useQuery } from "@apollo/client/react";

interface ScoreItemProps {
  description: string;
  value: number;
  actionHref?: string;
  actionLabel?: string;
  noAction?: boolean;
}

function ScoreItem({
  description,
  value,
  actionHref,
  actionLabel,
  noAction,
}: ScoreItemProps) {
  const isComplete = value !== 0;

  return (
    <li className="flex items-start justify-between">
      <div className="flex items-start">
        <span className="text-orange-500 mr-3">•</span>
        <span>{description}</span>
      </div>
      {noAction ? (
        <div>{isComplete ? "Completed" : "Not Completed"}</div>
      ) : isComplete ? (
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <SimpleButton href={actionHref}>{actionLabel}</SimpleButton>
      )}
    </li>
  );
}

export default function ScoreExplainer() {
  const { data, loading, error } = useQuery<GetUserScoreData>(GET_USER_SCORE);

  if (loading) return null;
  if (error) return <p>Error: {error.message}</p>;

  const score_details = data ? JSON.parse(data.getUserScore) : {};

  return (
    <div className="p-4">
      <div className="bg-secondary p-4 rounded-md border border-default overflow-auto customScrollbar flex flex-col gap-4">
        <h2 className="text-xl font-semibold">How Score is Calculated</h2>
        <ul className="space-y-4 text-neutral-600 dark:text-neutral-300">
          <ScoreItem description={`${score_details.base} is base score`} value={1} />
          <ScoreItem
            description="100 points for adding your first name"
            value={score_details.firstName}
            actionHref="/app/profile"
            actionLabel="Add"
          />
          <ScoreItem
            description="100 points for adding your last name"
            value={score_details.lastName}
            actionHref="/app/profile"
            actionLabel="Add"
          />
          <ScoreItem
            description="100 points for adding your date of birth"
            value={score_details.dateOfBirth}
            actionHref="/app/profile"
            actionLabel="Add"
          />
          <ScoreItem
            description="100 points if you added any data like note, account, email, password etc."
            value={score_details.metamodel}
            actionHref="/app/data/notes"
            actionLabel="Add"
          />
          <ScoreItem
            description="100 points if you have added at least one beneficiary"
            value={score_details.beneficiary}
            actionHref="/app/beneficiaries"
            actionLabel="Add"
          />
          <ScoreItem
            description="100 points if you have at least 3 sessions (opened Cipherwill) with Cipherwill within last 1 year"
            value={score_details.sessions}
            noAction
          />
          <ScoreItem
            description="50 points for having Cipherwill premium subscription"
            value={score_details.premium}
            actionHref="/app/billing"
            actionLabel="Upgrade"
          />
        </ul>
      </div>
    </div>
  );
}

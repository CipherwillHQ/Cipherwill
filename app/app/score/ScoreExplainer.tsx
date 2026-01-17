"use client";
import SimpleButton from "@/components/common/SimpleButton";
import GET_USER_SCORE from "@/graphql/ops/app/score/queries/GET_USER_SCORE";
import { GetUserScoreData } from "@/types";
import { useQuery } from "@apollo/client/react";

export default function ScoreExplainer() {
  const { data, loading, error, refetch } =
    useQuery<GetUserScoreData>(GET_USER_SCORE);
  if (loading) return null;
  if (error) return <p>Error: {error.message}</p>;
  const score_details = data ? JSON.parse(data.getUserScore) : {};
  return (
    <div className="p-4">
      {/* {JSON.stringify(score_details)} */}
      <div className="bg-secondary p-4 rounded-md border border-default overflow-auto customScrollbar flex flex-col gap-4">
        <h2 className="text-xl font-semibold">How Score is Calculated</h2>
        <ul className="space-y-4 text-neutral-600 dark:text-neutral-300">
          <li className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-orange-500 mr-3">•</span>
              <span>{score_details.base} is base score</span>
            </div>
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-orange-500 mr-3">•</span>
              <span>100 points for adding your first name</span>
            </div>
            {score_details.firstName === 0 ? (
              <SimpleButton href="/app/profile">Add</SimpleButton>
            ) : (
              <div>Completed</div>
            )}
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-orange-500 mr-3">•</span>
              <span>100 points for adding your last name</span>
            </div>

            {score_details.lastName === 0 ? (
              <SimpleButton href="/app/profile">Add</SimpleButton>
            ) : (
              <div>Completed</div>
            )}
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-orange-500 mr-3">•</span>
              <span>100 points for adding your date of birth</span>
            </div>

            {score_details.dateOfBirth === 0 ? (
              <SimpleButton href="/app/profile">Add</SimpleButton>
            ) : (
              <div>Completed</div>
            )}
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-orange-500 mr-3">•</span>
              <span>
                100 points if you added any data like note, account, email,
                password etc.
              </span>
            </div>

            {score_details.metamodel === 0 ? (
              <SimpleButton href="/app/data/notes">Add</SimpleButton>
            ) : (
              <div>Completed</div>
            )}
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-orange-500 mr-3">•</span>
              <span>100 points if you have added at least one beneficiary</span>
            </div>

            {score_details.beneficiary === 0 ? (
              <SimpleButton href="/app/beneficiaries">Add</SimpleButton>
            ) : (
              <div>Completed</div>
            )}
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-orange-500 mr-3">•</span>
              <span>
                100 points if you have at least 3 sessions (opened Cipherwill)
                with Cipherwill within last 1 year
              </span>
            </div>
            {score_details.sessions === 0 ? (
              <div>Not Completed</div>
            ) : (
              <div>Completed</div>
            )}
          </li>
          <li className="flex items-start justify-between">
            <div className="flex items-start">
              <span className="text-orange-500 mr-3">•</span>
              <span>50 points for having Cipherwill premium subscription</span>
            </div>

            {score_details.premium === 0 ? (
              <SimpleButton href="/app/billing">Upgrade</SimpleButton>
            ) : (
              <div>Completed</div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

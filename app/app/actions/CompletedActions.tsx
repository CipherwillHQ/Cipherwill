"use client";

import GET_COMPLETED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_COMPLETED_ACTIONS";
import { useQuery } from "@apollo/client/react";
import { GetCompletedActionsData, Action } from "@/types/interfaces";
import getTimeAgo from "@/common/time/getTimeAgo";

export default function CompletedActions() {
  const { data, loading, error } =
    useQuery<GetCompletedActionsData>(GET_COMPLETED_ACTIONS);

  if (loading) {
    return (
      <div className="">
        <div className="bg-neutral-200 dark:bg-neutral-800 animate-pulse w-full h-10 rounded-md" />
      </div>
    );
  }

  if (error)
    return (
      <div className="text-red-600 dark:text-red-400">
        Error: {JSON.stringify(error)}
      </div>
    );

  if (!data || !data.getCompletedActions || data.getCompletedActions.length === 0)
    return (
      <div className="text-neutral-600 dark:text-neutral-400">
        No completed actions found
      </div>
    );

  return (
    <div className="">
      <div className="space-y-4">
        {data.getCompletedActions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="flex-1">
              <p className="text-neutral-900 dark:text-neutral-100 font-medium">
                {action.action}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Created: {getTimeAgo(parseInt(action.created_at))}
              </p>
              {action.completed_at && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Completed: {getTimeAgo(parseInt(action.completed_at))}
                </p>
              )}
            </div>
            <div className="ml-4">
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                ✓ Completed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
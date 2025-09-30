"use client";

import GET_USER_ACTIONS from "@/graphql/ops/app/actions/queries/GET_USER_ACTIONS";
import { useQuery } from "@apollo/client/react";
import { GetUserActionsData, Action } from "@/types/interfaces";
import SimpleButton from "@/components/common/SimpleButton";
import { useRouter } from "next/navigation";
import actions_map from "./actions_map";
import toast from "react-hot-toast";

export default function UserActions() {
  const { data, loading, error } =
    useQuery<GetUserActionsData>(GET_USER_ACTIONS);
  const router = useRouter();

  const handleCompleteAction = (action: Action) => {
    const actionMapping = actions_map.find(
      (map) => map.completion_key === action.completion_key
    );
    if (actionMapping) {
      router.push(actionMapping.path);
    } else {
      toast.error("Error: Please try again after some time.");
      throw new Error(
        `No path mapped : ${action.completion_key} for action id: ${action.id}`
      );
    }
  };

  if (loading) {
    return (
      <div className="px-4">
        <div className="bg-neutral-200 dark:bg-neutral-800 animate-pulse w-full h-10 rounded-md" />
      </div>
    );
  }

  if (error)
    return (
      <div className="px-4 text-red-600 dark:text-red-400">
        Error: {JSON.stringify(error)}
      </div>
    );

  if (!data || !data.getUserActions)
    return (
      <div className="px-4 text-neutral-600 dark:text-neutral-400">
        No actions found
      </div>
    );

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
        User Actions
      </h1>
      <div className="space-y-4">
        {data.getUserActions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="flex-1">
              <p className="text-neutral-900 dark:text-neutral-100 font-medium">
                {action.action}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Created: {new Date(action.created_at).toLocaleString()}
              </p>
            </div>
            <div className="ml-4">
              {action.completed_at ? (
                <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                  Completed: {new Date(action.completed_at).toLocaleString()}
                </span>
              ) : (
                <SimpleButton
                  onClick={() => handleCompleteAction(action)}
                  variant="primary"
                  className="text-sm px-3 py-1"
                >
                  Complete
                </SimpleButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

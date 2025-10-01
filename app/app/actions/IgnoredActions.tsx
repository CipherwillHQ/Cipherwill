"use client";

import GET_IGNORED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_IGNORED_ACTIONS";
import GET_USER_ACTIONS from "@/graphql/ops/app/actions/queries/GET_USER_ACTIONS";
import GET_COMPLETED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_COMPLETED_ACTIONS";
import UNIGNORE_ACTION from "@/graphql/ops/app/actions/mutations/UNIGNORE_ACTION";
import { useQuery, useMutation } from "@apollo/client/react";
import { GetIgnoredActionsData, Action } from "@/types/interfaces";
import SimpleButton from "@/components/common/SimpleButton";
import getTimeAgo from "@/common/time/getTimeAgo";
import toast from "react-hot-toast";

export default function IgnoredActions() {
  const { data, loading, error } =
    useQuery<GetIgnoredActionsData>(GET_IGNORED_ACTIONS);
  const [unignoreAction] = useMutation(UNIGNORE_ACTION, {
    refetchQueries: [
      { query: GET_IGNORED_ACTIONS },
      { query: GET_USER_ACTIONS },
      { query: GET_COMPLETED_ACTIONS },
    ],
  });

  const handleUnignoreAction = async (action: Action) => {
    try {
      await unignoreAction({
        variables: { action_id: action.id },
      });
      toast.success("Action unignored successfully");
    } catch (err) {
      toast.error("Failed to unignore action");
      console.error("Error unignoring action:", err);
    }
  };

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

  if (!data || !data.getIgnoredActions || data.getIgnoredActions.length === 0)
    return (
      <div className="text-neutral-600 dark:text-neutral-400">
        No ignored actions found
      </div>
    );

  return (
    <div className="">
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Ignored Actions</h3>
        </div>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {data.getIgnoredActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-neutral-900 dark:text-neutral-100 font-medium truncate">
                  {action.action}
                </p>
                {action.description && (
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-1">
                    {action.description}
                  </p>
                )}
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Created: {getTimeAgo(parseInt(action.created_at))}
                </p>
                {action.ignored_at && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                    Ignored: {getTimeAgo(parseInt(action.ignored_at))}
                  </p>
                )}
              </div>
              <div className="ml-4">
                <SimpleButton
                  onClick={() => handleUnignoreAction(action)}
                  variant="secondary"
                  className=""
                >
                  Unignore
                </SimpleButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
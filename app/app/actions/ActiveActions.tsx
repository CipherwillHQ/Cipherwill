"use client";

import GET_USER_ACTIONS from "@/graphql/ops/app/actions/queries/GET_USER_ACTIONS";
import IGNORE_ACTION from "@/graphql/ops/app/actions/mutations/IGNORE_ACTION";
import MARK_ACTION_COMPLETED from "@/graphql/ops/app/actions/mutations/MARK_ACTION_COMPLETED";
import { useQuery, useMutation } from "@apollo/client/react";
import { GetUserActionsData, Action } from "@/types/interfaces";
import SimpleButton from "@/components/common/SimpleButton";
import { useRouter } from "next/navigation";
import actions_map from "./actions_map";
import toast from "react-hot-toast";
import getTimeAgo from "@/common/time/getTimeAgo";
import GET_IGNORED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_IGNORED_ACTIONS";
import GET_COMPLETED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_COMPLETED_ACTIONS";

export default function ActiveActions() {
  const { data, loading, error } =
    useQuery<GetUserActionsData>(GET_USER_ACTIONS,{
      fetchPolicy: "network-only",
    });

  const [ignoreAction] = useMutation(IGNORE_ACTION, {
    refetchQueries: [
      { query: GET_USER_ACTIONS },
      { query: GET_IGNORED_ACTIONS },
      { query: GET_COMPLETED_ACTIONS },
    ],
  });
  const [markActionCompleted] = useMutation(MARK_ACTION_COMPLETED, {
    refetchQueries: [
      { query: GET_USER_ACTIONS },
      { query: GET_IGNORED_ACTIONS },
      { query: GET_COMPLETED_ACTIONS },
    ],
  });
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

  const handleIgnoreAction = async (action: Action) => {
    try {
      await ignoreAction({
        variables: { action_id: action.id },
      });
      toast.success("Action ignored successfully");
    } catch (err) {
      toast.error("Failed to ignore action");
      console.error("Error ignoring action:", err);
    }
  };

  const handleMarkCompleted = async (action: Action) => {
    try {
      const { data } = await markActionCompleted({
        variables: { action_id: action.id },
      });

      const isCompleted = (data as any)?.markActionCompleted;

      if (isCompleted) {
        // Action was successfully marked as completed
        toast.success("Action completed!");
        // The refetchQueries will handle updating the lists
      } else {
        // Action needs manual completion, navigate to completion page
        handleCompleteAction(action);
      }
    } catch (err) {
      toast.error("Failed to mark action as completed");
      console.error("Error marking action completed:", err);
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

  if (!data || !data.getUserActions || data.getUserActions.length === 0)
    return (
      <div className="text-neutral-600 dark:text-neutral-400">
        No active actions found
      </div>
    );

  return (
    <div className="">
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <div className="bg-neutral-50 dark:bg-neutral-800 px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Active Actions
          </h3>
        </div>
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {data.getUserActions.map((action) => (
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
              </div>
              <div className="ml-4 flex flex-col space-y-1">
                {action.completed_at ? (
                  <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                    Completed: {new Date(action.completed_at).toLocaleString()}
                  </span>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <SimpleButton
                      onClick={() => handleMarkCompleted(action)}
                      variant="primary"
                    >
                      Complete
                    </SimpleButton>
                    <SimpleButton
                      onClick={() => handleIgnoreAction(action)}
                      variant="secondary"
                    >
                      Ignore
                    </SimpleButton>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

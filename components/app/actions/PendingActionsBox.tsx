"use client";

import GET_USER_ACTIONS from "@/graphql/ops/app/actions/queries/GET_USER_ACTIONS";
import MARK_ACTION_COMPLETED from "@/graphql/ops/app/actions/mutations/MARK_ACTION_COMPLETED";
import { useQuery, useMutation } from "@apollo/client/react";
import { GetUserActionsData, Action } from "@/types/interfaces";
import SimpleButton from "@/components/common/SimpleButton";
import { useRouter } from "next/navigation";
import actions_map from "@/app/app/actions/actions_map";
import toast from "react-hot-toast";
import getTimeAgo from "@/common/time/getTimeAgo";
import GET_IGNORED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_IGNORED_ACTIONS";
import GET_COMPLETED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_COMPLETED_ACTIONS";
import Link from "next/link";

export default function PendingActionsBox() {
  const { data, loading, error } =
    useQuery<GetUserActionsData>(GET_USER_ACTIONS,{
      fetchPolicy: "network-only",
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
      <div className="bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar">
        <div className="text-xl font-semibold pb-2">Pending Actions</div>
        <div className="space-y-2">
          <div className="bg-neutral-200 dark:bg-neutral-800 animate-pulse w-full h-10 rounded-md" />
          <div className="bg-neutral-200 dark:bg-neutral-800 animate-pulse w-full h-10 rounded-md" />
          <div className="bg-neutral-200 dark:bg-neutral-800 animate-pulse w-full h-10 rounded-md" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar">
        <div className="text-xl font-semibold pb-2">Pending Actions</div>
        <div className="text-red-600 dark:text-red-400 text-sm">
          Error loading actions
        </div>
      </div>
    );
  }

  // Filter to get pending actions (no completed_at and no ignored_at)
  const pendingActions = data?.getUserActions || [];

  // Sort by created_at descending (latest first) and take first 5
  const latestPendingActions = pendingActions.slice(0, 5);

  if (latestPendingActions.length === 0) {
    return (
      <div className="bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar">
        <div className="text-xl font-semibold pb-2">Pending Actions</div>
        <div className="text-neutral-600 dark:text-neutral-400 text-sm">
          No pending actions
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xl font-semibold pb-2">Pending Actions</div>
        <Link
          href="/app/actions"
          className="text-sm hover:underline opacity-80"
        >
          See all
        </Link>
      </div>
      <div className="space-y-3">
        {latestPendingActions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex-1 min-w-0">
              <p className="text-neutral-900 dark:text-neutral-100 font-medium">
                {action.action}
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm mt-1">
                {action.description}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                {getTimeAgo(parseInt(action.created_at))}
              </p>
            </div>
            <div className="ml-3">
              <SimpleButton
                onClick={() => handleMarkCompleted(action)}
                variant="primary"
                className="text-sm px-3 py-1"
              >
                Complete
              </SimpleButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

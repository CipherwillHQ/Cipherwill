"use client";

import { CiUndo } from "react-icons/ci";
import { useMutation, useQuery } from "@apollo/client/react";
import GET_USER_SCORE from "@/graphql/ops/app/actions/queries/GET_USER_SCORE";
import { GetUserScoreData } from "@/types/interfaces";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";
import Link from "next/link";
import ConfirmationButton from "@/components/common/ConfirmationButton";
import toast from "react-hot-toast";
import RECHECK_ALL_ACTIONS from "@/graphql/ops/app/actions/mutations/RECHECK_ALL_ACTIONS";
import GET_USER_ACTIONS from "@/graphql/ops/app/actions/queries/GET_USER_ACTIONS";
import GET_IGNORED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_IGNORED_ACTIONS";
import GET_COMPLETED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_COMPLETED_ACTIONS";
import BasicPopup from "@/components/BasicPopup";

interface UserScoreProps {
  maxScore?: number;
  description?: string;
  className?: string;
  improveScrollLink?: boolean;
}

export default function UserScore({
  maxScore = 950,
  description,
  className = "",
  improveScrollLink = false,
}: UserScoreProps) {
  const { data, loading, error } = useQuery<GetUserScoreData>(GET_USER_SCORE);
  const [recheckAllActions, { loading: rechecking }] = useMutation(RECHECK_ALL_ACTIONS, {
    refetchQueries: [
      { query: GET_USER_ACTIONS },
      { query: GET_IGNORED_ACTIONS },
      { query: GET_COMPLETED_ACTIONS },
      {
        query: GET_USER_SCORE,
      },
    ],
  });

  const score = data?.getUserScore || 0;
  // Normalize score between 300 and maxScore (default 950)
  const minScore = 300;
  const percentage = Math.max(
    0,
    Math.min(((score - minScore) / (maxScore - minScore)) * 100, 100)
  );

  // Animation state
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Animate progress bar after loading
  useEffect(() => {
    if (!loading && percentage > 0) {
      const duration = 1500; // 1.5 seconds
      const steps = 60; // 60 FPS
      const increment = percentage / steps;
      let currentStep = 0;

      const animate = () => {
        currentStep++;
        const currentPercentage = Math.min(increment * currentStep, percentage);
        setAnimatedPercentage(currentPercentage);

        if (currentStep < steps && currentPercentage < percentage) {
          requestAnimationFrame(animate);
        }
      };

      // Start animation after a brief delay
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 500);
    }
  }, [loading, percentage]);

  if (loading) {
    return (
      <div
        className={twMerge(
          "bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar flex flex-col justify-between",
          className
        )}
      >
        <div className="text-xl font-semibold pb-2">Cipherwill Score</div>
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-20 h-10 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-neutral-300 dark:bg-neutral-600 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Loading Scale */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-neutral-400 mb-1">
              <span>300</span>
              <span>600</span>
              <span>950</span>
            </div>
            <div className="relative h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden animate-pulse">
              <div className="absolute inset-0 flex">
                <div className="w-1/3 bg-neutral-300 dark:bg-neutral-600 opacity-50"></div>
                <div className="w-1/3 bg-neutral-300 dark:bg-neutral-600 opacity-50"></div>
                <div className="w-1/3 bg-neutral-300 dark:bg-neutral-600 opacity-50"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar flex flex-col justify-between">
        <div className="text-xl font-semibold pb-2">Cipherwill Score</div>
        <div className="text-red-600 dark:text-red-400 text-sm">
          Failed to load Cipherwill score
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={twMerge(
          "bg-secondary p-4 rounded-md border border-default h-96 overflow-auto customScrollbar animate-in fade-in duration-300 flex flex-col justify-between",
          className
        )}
      >
        <div className="text-xl flex justify-between">
          <h2 className="font-semibold">Cipherwill Score</h2>
          <div className="flex gap-4">
            {improveScrollLink && (
              <Link
                className="ml-2 text-sm opacity-70 hover:underline"
                href={"/app/actions"}
              >
                Improve score
              </Link>
            )}
            <CiUndo
              className={`inline ${rechecking ? "opacity-50 cursor-not-allowed" : "hover:cursor-pointer"}`}
              onClick={() => {
                if (rechecking) return;
                setShowConfirmModal(true);
              }}
            />
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400 animate-in slide-in-from-left duration-500 delay-100">
                {percentage.toFixed(1)}%
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {score}/{maxScore} points
              </span>
            </div>
          </div>
        </div>

        {/* Visual Scale */}
        <div>
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
            <span>300</span>
            <span>600</span>
            <span>950</span>
          </div>
          <div className="relative h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            {/* Color Zones Background */}
            <div className="absolute inset-0 flex">
              <div className="w-1/3 bg-red-500 opacity-20"></div>
              <div className="w-1/3 bg-yellow-500 opacity-20"></div>
              <div className="w-1/3 bg-green-500 opacity-20"></div>
            </div>

            {/* Progress Bar */}
            <div
              className="relative h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
              style={{ width: `${animatedPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Zone Labels */}
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            <span className="text-red-600 dark:text-red-400">Low</span>
            <span className="text-yellow-600 dark:text-yellow-400">Medium</span>
            <span className="text-green-600 dark:text-green-400">High</span>
          </div>
        </div>

        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-300 animate-in fade-in duration-500 delay-500">
            {description}
          </p>
        )}
      </div>

      <BasicPopup open={showConfirmModal} setOpen={setShowConfirmModal}>
        <div className="max-w-md">
          <h3 className="text-lg font-semibold mb-4">Confirm Score Refresh</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Are you sure you want to refresh your score? This will recalculate your score based on your current activities.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 text-sm bg-neutral-200 dark:bg-neutral-700 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowConfirmModal(false);
                toast.success("Score refresh initiated!");
                recheckAllActions();
              }}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors hover:cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </BasicPopup>
    </>
  );
}

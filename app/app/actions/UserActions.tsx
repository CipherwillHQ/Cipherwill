"use client";

import { useState, useEffect, useRef } from "react";
import ActiveActions from "./ActiveActions";
import IgnoredActions from "./IgnoredActions";
import CompletedActions from "./CompletedActions";
import RECHECK_ALL_ACTIONS from "@/graphql/ops/app/actions/mutations/RECHECK_ALL_ACTIONS";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import GET_USER_ACTIONS from "@/graphql/ops/app/actions/queries/GET_USER_ACTIONS";
import GET_IGNORED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_IGNORED_ACTIONS";
import GET_COMPLETED_ACTIONS from "@/graphql/ops/app/actions/queries/GET_COMPLETED_ACTIONS";
import ConfirmationButton from "@/components/common/ConfirmationButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import GET_USER_SCORE from "@/graphql/ops/app/actions/queries/GET_USER_SCORE";

export default function UserActions() {
  const [activeTab, setActiveTab] = useState<
    "active" | "ignored" | "completed"
  >("active");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [recheckAllActions] = useMutation(RECHECK_ALL_ACTIONS, {
    refetchQueries: [
      { query: GET_USER_ACTIONS },
      { query: GET_IGNORED_ACTIONS },
      { query: GET_COMPLETED_ACTIONS },
      {
        query: GET_USER_SCORE,
      },
    ],
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRecheckAllActions = async () => {
    try {
      await recheckAllActions();
      toast.success("All actions have been rechecked!");
      setIsMenuOpen(false); // Close menu after action
    } catch (err) {
      toast.error("Failed to recheck actions");
      console.error("Error rechecking actions:", err);
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("active")}
            className={`mx-2 p-1 hover:cursor-pointer ${
              activeTab === "active" && "border-b-2 border-accent-500"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("ignored")}
            className={`mx-2 p-1 hover:cursor-pointer ${
              activeTab === "ignored" && "border-b-2 border-accent-500"
            }`}
          >
            Ignored
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`mx-2 p-1 hover:cursor-pointer ${
              activeTab === "completed" && "border-b-2 border-accent-500"
            }`}
          >
            Completed
          </button>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            <BsThreeDotsVertical size={16} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-10">
              <div className="py-1">
                <ConfirmationButton
                  onConfirm={handleRecheckAllActions}
                  confirmText="Click again to confirm recheck"
                  className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  Recheck All Actions
                </ConfirmationButton>
              </div>
            </div>
          )}
        </div>
      </div>
      {activeTab === "active" ? (
        <ActiveActions />
      ) : activeTab === "ignored" ? (
        <IgnoredActions />
      ) : (
        <CompletedActions />
      )}
    </div>
  );
}

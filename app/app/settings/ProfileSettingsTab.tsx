"use client";

import { useMutation } from "@apollo/client/react";
import { useAuth } from "@/contexts/AuthContext";
import FeedbackConfirmationButton from "@/components/common/FeedbackConfirmationButton";
import DELETE_DATA from "@/graphql/ops/auth/mutations/DELETE_DATA";
import DELETE_ACCOUNT from "@/graphql/ops/auth/mutations/DELETE_ACCOUNT";
import Profile from "../profile/Profile";

export default function ProfileSettingsTab() {
  const { logout } = useAuth();
  const [deleteData] = useMutation(DELETE_DATA);
  const [deleteAccount] = useMutation(DELETE_ACCOUNT);

  return (
    <div className="flex flex-col gap-4">
      <Profile />

      <div className="max-w-3xl bg-secondary p-4 rounded-md border border-default">
        <div className="text-lg font-medium pb-2">Logout</div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm pb-4 max-w-md">
            This will log you out of your account. You will need to log in
            again to access your account. Are you sure you want to log out?
          </div>
          <button
            onClick={logout}
            className="border hover:cursor-pointer border-red-500 hover:bg-red-100 text-red-500 hover:text-red-700 px-8 py-1 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-3xl bg-secondary p-4 rounded-md border border-red-500/40">
        <div className="text-lg font-medium pb-2 text-red-500">Danger Zone</div>

        <div className="pb-4 border-b border-default">
          <div className="text-base font-medium pb-2">Reset account</div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm pb-4 max-w-md">
              This will delete all your account data and log you out. You will
              need to log in again to access your account. Are you sure you want
              to delete all your account data?
              <span className="block mt-2 font-semibold">
                Note: The reset process take up to 24 hours to complete.
              </span>
            </div>
            <FeedbackConfirmationButton
              options={[
                "I was just exploring/testing",
                "It felt overwhelming",
                "I didn't understand what to do next",
                "I don't need this yet",
                "Security concerns",
              ]}
              onConfirm={() => {
                deleteData().then(() => {
                  logout();
                });
              }}
              confirmText="Are you sure you want to reset your account?"
              feedbackPrompt="Help us improve! Please share why you're resetting your account:"
              actionType="account reset"
              className="border border-red-500 hover:bg-red-100 text-red-500 hover:text-red-700 px-8 py-1 rounded-md"
            >
              Reset account
            </FeedbackConfirmationButton>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-base font-medium pb-2">Delete account</div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm pb-4 max-w-md">
              This will delete your account and all associated data. Are you
              sure you want to delete your account?
            </div>
            <FeedbackConfirmationButton
              options={[
                "I was just exploring/testing",
                "It felt overwhelming",
                "I didn't understand what to do next",
                "I don't need this yet",
                "Security concerns",
              ]}
              onConfirm={() => {
                deleteAccount().then(() => {
                  logout();
                });
              }}
              confirmText="Are you sure you want to delete your account?"
              feedbackPrompt="We're sorry to see you go. Please share why you're deleting your account:"
              actionType="account deletion"
              className="border border-red-500 hover:bg-red-100 text-red-500 hover:text-red-700 px-8 py-1 rounded-md"
            >
              Delete account
            </FeedbackConfirmationButton>
          </div>
        </div>
      </div>
    </div>
  );
}

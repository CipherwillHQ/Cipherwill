"use client";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useMutation } from "@apollo/client/react";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import { useAuth } from "@/contexts/AuthContext";
import Popup from "reactjs-popup";

export default function FeedbackConfirmationButton({
  children,
  onConfirm,
  confirmText = "Are you sure?",
  feedbackPrompt = "Please share any feedback before proceeding:",
  className = "",
  actionType = "action",
  ...props
}: {
  children: any;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  feedbackPrompt?: string;
  className?: string;
  actionType?: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sendFeedback] = useMutation(SEND_FEEDBACK);
  const { user } = useAuth();

  const handleSubmitFeedback = async () => {
    setIsProcessing(true);
    try {
      if (feedback.trim()) {
        await sendFeedback({
          variables: {
            email: user?.email,
            message: `Feedback for ${actionType}: ${feedback}`,
          },
        });
      }
      await onConfirm();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Still proceed with the action even if feedback fails
      await onConfirm();
    } finally {
      setIsProcessing(false);
      setFeedback("");
    }
  };

  return (
    <Popup
      trigger={
        <button
          className={twMerge("hover:cursor-pointer", className)}
          {...props}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white mr-2" />
              <span>Processing...</span>
            </div>
          ) : (
            children
          )}
        </button>
      }
      position="bottom center"
      on="click"
      closeOnDocumentClick
      closeOnEscape
      contentStyle={{
        padding: '0px',
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'transparent',
        minWidth: '320px',
        zIndex: 1000,
      }}
      arrowStyle={{
        color: 'white',
        borderColor: 'transparent',
      }}
      overlayStyle={{
        background: 'rgba(0, 0, 0, 0.75)',
      }}
      modal
    >
      {/* @ts-ignore */}
      {(close) => (
        <div className="w-full max-w-md mx-auto rounded-xl bg-secondary border border-default p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-neutral-100 mb-1">
                {confirmText}
              </h3>
              <p className="text-sm text-muted-foreground text-neutral-600 dark:text-neutral-400">
                {feedbackPrompt}
              </p>
            </div>
            <button
              aria-label="Close confirmation dialog"
              onClick={close}
              className="text-sm text-muted-foreground hover:text-gray-700 dark:text-neutral-300 dark:hover:text-neutral-100 rounded-full p-1 hover:cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your feedback (optional)..."
              className="w-full rounded-lg border border-default bg-white dark:bg-secondary-900 p-3 text-sm placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-500 resize-none"
              rows={3}
              autoFocus
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3 gap-2">
            <button
              onClick={close}
              className="w-full sm:w-auto px-4 py-2 text-sm border border-default rounded-lg hover:bg-neutral-50 dark:hover:bg-secondary-900 text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitFeedback}
              disabled={isProcessing}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? "Submitting..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
}
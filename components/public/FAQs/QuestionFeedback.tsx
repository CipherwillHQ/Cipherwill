"use client";
import { useUserContext } from "@/contexts/UserSetupContext";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import toast from "react-hot-toast";

export default function QuestionFeedback({ question }: { question: string }) {
  const [sendFeedback] = useMutation(SEND_FEEDBACK);
  const { user } = useUserContext();

  const sendFeedbackHandler = useCallback((message: string) => {
    sendFeedback({
      variables: {
        email: user?.email,
        message: `${message}`,
      },
    })
      .then((res) => {
        toast.success("Feedback sent successfully!");
      })
      .catch((err) => {
        toast.error("Something went wrong!!! Please send us a email.");
      });
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-6">
      <h3 className="font-semibold">Did this answer your question?</h3>
      <button
        className="border rounded-md py-2 px-4 text-sm font-semibold hover:bg-slate-100"
        onClick={() => {
          sendFeedbackHandler(`Question: ${question} - Answered my question`);
        }}
      >
        Yes
      </button>
      <button
        className="border rounded-md py-2 px-4 text-sm font-semibold hover:bg-slate-100"
        onClick={() => {
          sendFeedbackHandler(
            `Question: ${question} - Did not answer my question`
          );
        }}
      >
        No
      </button>
    </div>
  );
}

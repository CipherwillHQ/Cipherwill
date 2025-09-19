import { useState } from "react";
import SimpleButton from "@/components/common/SimpleButton";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import {
  SendFeedbackMutation,
  SendFeedbackVariables,
} from "@/types/interfaces/metamodel";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import Popup from "reactjs-popup";

const MAX_CHARS = 1000;

export default function SuggestionBox({ triggerText = "Give us Feedback" }: { triggerText?: string }) {
  const [sendFeedback, { loading }] = useMutation<
    SendFeedbackMutation,
    SendFeedbackVariables
  >(SEND_FEEDBACK);

  const [message, setMessage] = useState("");

  const handleSend = async (close: () => void) => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    try {
      await sendFeedback({ variables: { message } });
      toast.success("Thanks — your suggestion was sent!");
      setMessage("");
      close();
    } catch (err) {
      console.error(err);
      toast.error("Unable to send suggestion. Try again later.");
    }
  };

  return (
    <Popup
      trigger={
        <button className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold border border-default hover:cursor-pointer">
          {triggerText}
        </button>
      }
      overlayStyle={{ background: "rgba(0, 0, 0, 0.75)" }}
      modal
      nested
    >
      {/* @ts-ignore */}
      {(close: () => void) => (
  <div className="w-full max-w-xl mx-auto rounded-2xl bg-white dark:bg-secondary-950 border border-default p-6 md:p-8 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg md:text-2xl font-semibold text-black dark:text-neutral-100">Tell us what we can do better</h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-prose text-neutral-600 dark:text-neutral-400">
                We're always looking for ways to improve Cipherwill. Share a feature idea, improvement, or a small detail that would make your experience better.
              </p>
            </div>
            <button
              aria-label="Close suggestion dialog"
              onClick={() => close()}
              className="text-sm text-muted-foreground hover:text-gray-700 dark:text-neutral-300 dark:hover:text-neutral-100 rounded-full p-1 hover:cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mt-4">
            <label htmlFor="suggestion-textarea" className="sr-only">
              Suggestion message
            </label>
            <textarea
              id="suggestion-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
              rows={6}
              placeholder={`What would make Cipherwill better? (max ${MAX_CHARS} characters)`}
              className="w-full rounded-lg border border-default bg-secondary p-3 text-sm placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-secondary-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-500 resize-none"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground text-neutral-600 dark:text-neutral-400">
              <span className="text-neutral-600 dark:text-neutral-300">{message.length}/{MAX_CHARS} characters</span>
              <span className="hidden md:inline">We review every suggestion personally — thanks for helping!</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3 gap-2">
            <SimpleButton
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => {
                setMessage("");
                close();
              }}
            >
              Cancel
            </SimpleButton>

            <SimpleButton
              className="w-full sm:w-auto"
              onClick={() => handleSend(close)}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send suggestion"}
            </SimpleButton>
          </div>
        </div>
      )}
    </Popup>
  );
}

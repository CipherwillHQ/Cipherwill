import SimpleButton from "@/components/common/SimpleButton";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import {
  SendFeedbackMutation,
  SendFeedbackVariables,
} from "@/types/interfaces/metamodel";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import Popup from "reactjs-popup";

export default function SuggestionBox() {
  const [sendFeedback] = useMutation<
    SendFeedbackMutation,
    SendFeedbackVariables
  >(SEND_FEEDBACK);

  return (
    <Popup
      trigger={
        <button className="border border-default rounded-full py-1 px-4 text-xs font-semibold">
          Suggest a feature
        </button>
      }
      modal
    >
      {/* @ts-ignore */}
      {(close) => {
        return (
          <div className="flex flex-col gap-2 bg-white dark:bg-neutral-800 text-black dark:text-white border border-default rounded-md p-4 max-w-sm">
            <h2 className="text-xl font-semibold">
              Tell us what we can do better
            </h2>
            <p className="text-sm opacity-80">
              We're always looking for ways to improve CipherWill. <br />If you have a
              suggestion, please let us know.
            </p>
            <input
              id="suggestion-input"
              type="text"
              placeholder="Message"
              className="w-full bg-secondary p-2 rounded-md"
            />
            <SimpleButton
              className="w-full"
              onClick={() => {
                const message = (
                  document.getElementById("suggestion-input") as any
                )?.value;
                if (!message) {
                  toast.error("Please enter a message");
                  return;
                }
                sendFeedback({
                  variables: {
                    message,
                  },
                });
                close();
              }}
            >
              Send to us
            </SimpleButton>
          </div>
        );
      }}
    </Popup>
  );
}

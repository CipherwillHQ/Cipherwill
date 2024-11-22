"use client";
import SimpleButton from "@/components/common/SimpleButton";
import { useUserContext } from "@/contexts/UserSetupContext";
import SEND_FEEDBACK from "@/graphql/ops/generic/mutations/SEND_FEEDBACK";
import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AskAQuestion() {
  const { user } = useUserContext();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendFeedback] = useMutation(SEND_FEEDBACK);
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  return (
    <div className="flex flex-col gap-2 my-4 w-full">
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded-md text-sm w-full font-medium"
      />
      <textarea
        placeholder="Ask a question"
        className="border p-2 rounded-md text-sm w-full font-medium"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <SimpleButton
        onClick={() => {
          if (message) {
            sendFeedback({ variables: { email, message } });
            toast.success("Your question has been sent");
            setMessage("");
          } else {
            toast.error("Please enter a message");
          }
        }}
      >
        Send to the team
      </SimpleButton>
    </div>
  );
}

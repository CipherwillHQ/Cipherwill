// What it does: Adds a guest and displays the actual invitation-email outcome.
// What it owns: Invitation options, send feedback, and retries after a failed send.
// What it does NOT do: Treat person creation as proof of email delivery.

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { FiMail, FiUser, FiSend, FiArrowLeft } from "react-icons/fi";
import SimpleButton from "@/components/common/SimpleButton";
import INVITE_USER from "@/graphql/ops/app/people/mutations/INVITE_USER";
import { PersonRef } from "@/types/Will";
import type { InviteUserData, InviteUserVariables } from "@/types/interfaces";
import invitationFeedback from "@/common/email/invitationFeedback";
import toast from "react-hot-toast";
import LoadingIndicator from "../../common/LoadingIndicator";

export default function InvitationBox({
  inputEmail,
  inputName = "",
  field,
  response,
  onClose,
}: {
  inputEmail: string;
  inputName?: string;
  field: string | null;
  response: (response: PersonRef) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(inputName);
  const [isInviting, setIsInviting] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [anonymousInvite, setAnonymousInvite] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hasAttemptedEmail, setHasAttemptedEmail] = useState(false);
  const [inviteUser] = useMutation<InviteUserData, InviteUserVariables>(INVITE_USER);

  const handleInvite = async () => {
    if (!name.trim()) return;

    setIsInviting(true);
    setFeedback(null);
    try {
      const { data } = await inviteUser({
        variables: {
          first_name: name.trim(),
          email: inputEmail,
          send_email: sendEmail,
          anonymous_invite: sendEmail ? anonymousInvite : false,
        },
      });
      if (!data?.inviteUser) throw new Error("Invitation failed. Please try again.");
      const outcome = data.inviteUser.invitation_email;
      const message = invitationFeedback(outcome);
      if (sendEmail) setHasAttemptedEmail(true);
      if (outcome.status === "failed" || (sendEmail && outcome.status === "skipped" && data.inviteUser.__typename !== "User")) {
        setFeedback(message);
        return;
      }
      if (outcome.status === "sent") toast.success(message);
      else toast(message);
      response({ person: data.inviteUser.id, field });
      onClose();
    } catch (error) {
      console.error("Invitation failed:", error);
      setFeedback(error instanceof Error ? error.message : "Invitation failed. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <FiMail className="text-green-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Send Invitation</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Back"
        >
          <FiArrowLeft size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Email Info */}
        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <FiMail className="text-blue-500" size={18} />
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {sendEmail ? "Request an invitation email for:" : "We'll add this person without emailing:"}
            </p>
            <p className="font-medium text-blue-800 dark:text-blue-200">{inputEmail}</p>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FiUser size={16} />
            First Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter their first name"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={isInviting || hasAttemptedEmail}
          />
        </div>

        {/* Send Email Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="send-email"
            checked={sendEmail}
            onChange={(e) => {
              const nextValue = e.target.checked;
              setSendEmail(nextValue);
              if (!nextValue) setAnonymousInvite(false);
            }}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            disabled={isInviting}
          />
          <label htmlFor="send-email" className="text-sm text-gray-700 dark:text-gray-300">
            Send invitation email
          </label>
        </div>

        {/* Anonymous Invite Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anonymous-invite"
            checked={anonymousInvite}
            onChange={(e) => setAnonymousInvite(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            disabled={isInviting || !sendEmail || hasAttemptedEmail}
          />
          <label htmlFor="anonymous-invite" className="text-sm text-gray-700 dark:text-gray-300">
            Send invitation anonymously (they won't know who invited them)
          </label>
        </div>

        {/* Action Button */}
        {feedback && <p role="alert" className="text-sm text-amber-700 dark:text-amber-300">
          {feedback} You can retry or turn off “Send invitation email” to add this person without emailing.
        </p>}
        <SimpleButton
          onClick={handleInvite}
          disabled={!name.trim() || isInviting}
          className="w-full flex items-center justify-center gap-2 py-3"
        >
          {isInviting ? (
            <>
              <LoadingIndicator />
              Sending Invitation...
            </>
          ) : (
            <>
              <FiSend size={18} />
              {sendEmail ? (hasAttemptedEmail ? "Retry invitation" : `Invite ${name.trim() || "User"}`) : "Add person without emailing"}
            </>
          )}
        </SimpleButton>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {sendEmail
            ? "Guests can receive one invitation before verifying their address. Retries use the original invitation details."
            : "No email will be sent. You can notify them later."}
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { FiMail, FiUser, FiSend, FiArrowLeft, FiCheck } from "react-icons/fi";
import SimpleButton from "@/components/common/SimpleButton";
import INVITE_USER from "@/graphql/ops/app/people/mutations/INVITE_USER";
import { PersonRef } from "@/types/Will";
import { InviteUserData, InviteUserVariables } from "@/types/interfaces/people";
import LoadingIndicator from "../../common/LoadingIndicator";

export default function InvitationBox({
  inputEmail,
  field,
  response,
  onClose,
}: {
  inputEmail: string;
  field: string | null;
  response: (response: PersonRef) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteUser] = useMutation<InviteUserData, InviteUserVariables>(INVITE_USER);

  const handleInvite = async () => {
    if (!name.trim()) return;

    setIsInviting(true);
    try {
      await inviteUser({
        variables: {
          first_name: name.trim(),
          email: inputEmail,
        },
        onCompleted(data, clientOptions) {
          if (data && data.inviteUser) {
            response({
              person: data.inviteUser.id,
              field,
            });
            onClose();
          }
        },
      });
    } catch (error) {
      console.error("Invitation failed:", error);
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
              We'll send an invitation to:
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
            disabled={isInviting}
          />
        </div>

        {/* Action Button */}
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
              Invite {name.trim() || "User"}
            </>
          )}
        </SimpleButton>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          They'll receive an email with instructions to join Cipherwill
        </p>
      </div>
    </div>
  );
}

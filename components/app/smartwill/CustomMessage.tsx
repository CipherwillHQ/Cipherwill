/**
 * CustomMessage modal component for creating and updating beneficiary messages.
 * Owns beneficiary custom message editing, mutation, deletion, and unsaved changes confirmation.
 * Does NOT own beneficiary data loading or key migration logic.
 */
import UPDATE_CUSTOM_MESSAGE_FOR_BENEFICIARY from "@/graphql/ops/app/smartwill/mutations/UPDATE_CUSTOM_MESSAGE";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import React, { useState } from "react";
import SimpleButton from "@/components/common/SimpleButton";
import BasicPopup from "@/components/BasicPopup";
import ConfirmationPopup from "@/components/app/smartwill/ConfirmationPopup";
import { IoClose } from "react-icons/io5";

export default function CustomMessage({
  beneficiary_id,
  custom_message,
}: {
  beneficiary_id: string;
  custom_message: string | null;
}) {
  const [update_custom_message, { loading, error }] = useMutation(
    UPDATE_CUSTOM_MESSAGE_FOR_BENEFICIARY,
    { refetchQueries: ["GET_SMARTWILL_BENEFICIARY"] }
  );
  const [showModal, setShowModal] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading || submitting) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-primary mr-2" />
        Loading...
      </div>
    );
  }
  if (error) return <div className="text-sm text-red-500">Error: {error.message}</div>;

  const handleCloseModal = () => {
    if (message !== (custom_message || "")) {
      setShowDiscardConfirm(true);
    } else {
      setShowModal(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await update_custom_message({
        variables: { beneficiary_id, custom_message: message },
      });
      toast.success(`Message ${custom_message ? "updated" : "created"} successfully!`);
      setShowModal(false);
      setMessage("");
    } catch (err: any) {
      toast.error(`Error ${custom_message ? "updating" : "creating"} message: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await update_custom_message({
        variables: { beneficiary_id, custom_message: null },
      });
      toast.success("Message deleted successfully!");
      setShowModal(false);
      setMessage("");
    } catch (err: any) {
      toast.error(`Error deleting message: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SimpleButton
        variant="secondary"
        onClick={() => {
          setMessage(custom_message || "");
          setShowModal(true);
        }}
      >
        {custom_message ? "Update Message" : "Create Message"}
      </SimpleButton>

      <BasicPopup open={showModal} setOpen={handleCloseModal} closeOnBackdropClick={false}>
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {custom_message ? "Update" : "Create"} Message for Beneficiary
            </h3>
            <button
              onClick={handleCloseModal}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <IoClose size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Write a personal message that will be delivered to this beneficiary when your will is executed.
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Message</label>
              <textarea
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= 2000) setMessage(e.target.value);
                }}
                maxLength={2000}
                rows={6}
                placeholder="Enter your message here..."
                className="w-full rounded-md border border-default bg-white dark:bg-gray-800 p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-24"
                autoFocus
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  This message will be sent via email and will be visible on dashboard.
                </span>
                <span className={message.length === 2000 ? "text-red-500" : "text-gray-500 dark:text-gray-400"}>
                  {message.length}/2000
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4 border-t border-default">
              <div className="flex gap-3">
                {custom_message && (
                  <button
                    onClick={handleDelete}
                    disabled={submitting}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-red-300 text-red-600 dark:text-red-400 dark:border-red-600 rounded-md bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-default rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <SimpleButton
                  onClick={handleSubmit}
                  className={`w-full sm:w-auto px-6 py-2 text-sm font-medium ${
                    !message.trim() || submitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white" />
                      {custom_message ? "Updating..." : "Creating..."}
                    </div>
                  ) : custom_message ? (
                    "Update Message"
                  ) : (
                    "Create Message"
                  )}
                </SimpleButton>
              </div>
            </div>
          </div>
        </div>
      </BasicPopup>

      <ConfirmationPopup
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        onConfirm={() => {
          setShowDiscardConfirm(false);
          setShowModal(false);
          setMessage(custom_message || "");
        }}
        title="Discard Unsaved Changes?"
        message="You have unsaved changes in your message. If you exit now, your changes will be lost."
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        variant="warning"
      />
    </>
  );
}

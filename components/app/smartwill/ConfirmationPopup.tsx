import { useState } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import BasicPopup from "../../BasicPopup";
import SimpleButton from "../../common/SimpleButton";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmationPopup({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmationPopupProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
      onClose();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <FiAlertTriangle className="text-red-500" size={24} />,
          headerBg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
          confirmButton: "danger" as const,
        };
      case "warning":
        return {
          icon: <FiAlertTriangle className="text-yellow-500" size={24} />,
          headerBg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
          confirmButton: "danger" as const,
        };
      case "info":
        return {
          icon: <FiAlertTriangle className="text-blue-500" size={24} />,
          headerBg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
          confirmButton: "primary" as const,
        };
      default:
        return {
          icon: <FiAlertTriangle className="text-red-500" size={24} />,
          headerBg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
          confirmButton: "danger" as const,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <BasicPopup
    popup_className="p-0 m-0"
    open={isOpen} setOpen={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full">
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 ${variantStyles.headerBg}`}>
          <div className="flex items-center gap-3">
            {variantStyles.icon}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isConfirming}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <SimpleButton
              variant={variantStyles.confirmButton}
              onClick={handleConfirm}
              disabled={isConfirming}
              className="px-4 py-2"
            >
              {isConfirming ? "Processing..." : confirmText}
            </SimpleButton>
          </div>
        </div>
      </div>
    </BasicPopup>
  );
}
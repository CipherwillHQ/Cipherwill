"use client";
import { useState, useEffect } from "react";

export default function ConfirmationButton({
  children,
  onConfirm,
  confirmText = "Are you sure?",
  className = "",
  ...props
}: {
  children: any;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  className?: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [underConfirmation, setUnderConfirmation] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (underConfirmation) {
      timeout = setTimeout(() => {
        setUnderConfirmation(false);
      }, 5000); // clear confirmation if not confirmed in 5 seconds
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [underConfirmation]);

  return (
    <button
      onClick={async () => {
        if (isProcessing) return;
        if (underConfirmation) {
          setUnderConfirmation(false);
          setIsProcessing(true);
          await onConfirm();
          setIsProcessing(false);
        } else {
          setUnderConfirmation(true);
        }
      }}
      className={className}
      {...props}
    >
      {isProcessing ? (
        <div
        className="flex items-center justify-center"
        >
          <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white mr-2" />
          <span>Processing...</span>
        </div>
      ) : underConfirmation ? (
        confirmText
      ) : (
        children
      )}
    </button>
  );
}

/**
 * BasicPopup modal dialog wrapper with backdrop overlay.
 * Owns modal visibility overlay, backdrop interaction, and container styling.
 * Does NOT own modal business logic or form state.
 */
import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";

export default function BasicPopup({
  open,
  setOpen,
  children,
  bg_className,
  popup_className,
  closeOnBackdropClick = true,
}: {
  open: any;
  setOpen: (open: any) => void;
  children: React.ReactNode;
  bg_className?: string;
  popup_className?: string;
  closeOnBackdropClick?: boolean;
}) {
  const isMouseDownOnBackdrop = useRef(false);

  if (!open) return null;

  return (
    <div
      className={twMerge(
        "fixed top-0 left-0 right-0 bottom-0 p-4 flex flex-col items-center justify-center bg-black/80 overflow-x-hidden z-50",
        bg_className
      )}
      onMouseDown={(e) => {
        isMouseDownOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (
          closeOnBackdropClick &&
          isMouseDownOnBackdrop.current &&
          e.target === e.currentTarget
        ) {
          setOpen(null);
        }
        isMouseDownOnBackdrop.current = false;
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={twMerge(
          "bg-white dark:bg-neutral-900 p-4 rounded-sm shadow-md w-full max-w-fit",
          popup_className
        )}
      >
        {children}
      </div>
    </div>
  );
}

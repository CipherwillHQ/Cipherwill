"use client";
import LoadingIndicator from "./LoadingIndicator";

interface SaveButtonProps {
  isDirty: boolean;
  isUpdating: boolean;
  onClick: () => void;
}

export default function SaveButton({
  isDirty,
  isUpdating,
  onClick,
}: SaveButtonProps) {
  const disabled = !isDirty || isUpdating;

  return (
    <button
      className={`flex items-center justify-center gap-2 text-white font-semibold py-2.5 px-4 rounded-xl w-full transition-all duration-200 active:scale-[0.98] ${
        disabled
          ? "bg-clay opacity-50 cursor-not-allowed"
          : "bg-clay hover:brightness-110 cursor-pointer"
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {isUpdating && <LoadingIndicator />}
      {disabled && !isUpdating ? "Saved" : "Save changes"}
    </button>
  );
}

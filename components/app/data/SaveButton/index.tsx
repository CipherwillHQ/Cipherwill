"use client";
// Shared save button with disabled/saving/saved states.
// Uses design system primary color, dark/light mode friendly.
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { isFormDirty } from "@/components/app/data/isFormDirty";

export default function SaveButton<T extends Record<string, unknown>>({
  data,
  initialData,
  isSaving,
  onClick,
}: {
  data: T;
  initialData: T | null;
  isSaving: boolean;
  onClick: () => Promise<void>;
}) {
  const dirty = isFormDirty(data, initialData);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <button
        disabled={!dirty || isSaving}
        className="flex items-center justify-center gap-2 bg-clay text-black/75 ds font-bold py-2 px-4 rounded-sm w-full disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        onClick={onClick}>
        {isSaving && <LoadingIndicator />}
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

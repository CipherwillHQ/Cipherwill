// Live preview of pod data in natural-language format with sensitive value masking.
// Owns: PreviewValue (masked/plain/add-button states), NotePreview, buildAddButtonProps helper, PodPreviewSection, MetamodelName.
"use client";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export function MetamodelName({
  name,
  fallback,
}: {
  name?: string | null;
  fallback: string;
}) {
  return (
    <span className="font-semibold text-forest dark:text-cream">
      {name || fallback}
    </span>
  );
}

interface PreviewValueProps {
  value?: string;
  fallback?: string;
  sensitive?: boolean;
  maskLast4?: boolean;
  addLabel?: string;
  onAdd?: () => void;
}

export function PreviewValue({
  value,
  fallback = "...",
  sensitive,
  maskLast4,
  addLabel,
  onAdd,
}: PreviewValueProps) {
  const [revealed, setRevealed] = useState(false);

  if (value && value.trim()) {
    if (sensitive || maskLast4) {
      let masked: string;
      if (maskLast4 && value.length >= 4) {
        const last4 = value.slice(-4);
        const maskedPart = "•••• •••• •••• ";
        masked = maskedPart + last4;
      } else {
        masked = "••••••••";
      }
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-forest dark:text-cream">
          {revealed ? value : masked}
          <button
            type="button"
            onClick={() => setRevealed(!revealed)}
            className="inline-flex text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            {revealed ? <BsEyeSlash size={14} /> : <BsEye size={14} />}
          </button>
        </span>
      );
    }
    return (
      <span className="font-semibold text-forest dark:text-cream">
        {value}
      </span>
    );
  }

  if (addLabel && onAdd) {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-dashed border-default text-neutral-400 hover:text-primary hover:border-primary text-xs font-medium transition-colors cursor-pointer"
        onClick={onAdd}
      >
        + {addLabel}
      </button>
    );
  }

  return <span className="text-neutral-400 italic">{fallback}</span>;
}

interface AddButtonProps {
  addLabel?: string;
  onAdd?: () => void;
}

// Builds props for a PreviewValue's "+ Add <label>" button. Returns empty object when
// the field is not addable (mandatory), so spread is a no-op. Caller wires the result
// straight onto <PreviewValue ...{...buildAddButtonProps(...)} />.
export function buildAddButtonProps(
  fieldKey: string,
  fieldLabel: string,
  isAddable: (key: string) => boolean,
  addAndClose: (key: string) => void,
): AddButtonProps {
  if (!isAddable(fieldKey)) return {};
  return { addLabel: fieldLabel, onAdd: () => addAndClose(fieldKey) };
}

interface NotePreviewProps {
  value?: string;
  skippable: boolean;
  addable: boolean;
  addAndClose: (key: string) => void;
}

export function NotePreview({ value, skippable, addable, addAndClose }: NotePreviewProps) {
  if (!value && skippable) return null;
  return (
    <p>
      For context,{" "}
      <PreviewValue
        value={value}
        addLabel={addable ? "Note" : undefined}
        onAdd={addable ? () => addAndClose("note") : undefined}
      />
      .
    </p>
  );
}

interface PodPreviewSectionProps {
  children: React.ReactNode;
}

export default function PodPreviewSection({ children }: PodPreviewSectionProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 sm:p-8">
        <div className="hidden sm:block text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-6">
          Preview
        </div>
        <div className="text-[15px] text-forest dark:text-cream leading-[1.8] space-y-5 font-normal">
          {children}
        </div>
      </div>
    </div>
  );
}

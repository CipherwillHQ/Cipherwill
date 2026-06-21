// Live preview of pod data in natural-language format with sensitive value masking.
// Owns: PreviewValue (masked/plain/add-button states) and PodPreviewSection (layout wrapper).
"use client";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

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

interface PodPreviewSectionProps {
  children: React.ReactNode;
}

export default function PodPreviewSection({ children }: PodPreviewSectionProps) {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-4">
        Preview
      </div>
      <div className="text-sm text-forest dark:text-cream leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

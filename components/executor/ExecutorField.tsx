// Presents one shared data field with explicit sensitive-value reveal.
// Owns the local visibility state and read-only field presentation.
// Does not decrypt, edit, or persist the value.

"use client";

import { useState } from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";
import type { ExecutorFieldProps } from "@/types/interfaces";

export default function ExecutorField({ label, value, sensitive, monospace = false }: ExecutorFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const text = Array.isArray(value) ? value.join("\n") : value;

  return (
    <div className="min-w-0 rounded-xl border border-default bg-secondary p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{label}</dt>
        {sensitive && (
          <button
            type="button"
            aria-label={(revealed ? "Hide " : "Reveal ") + label}
            aria-pressed={revealed}
            onClick={() => setRevealed(!revealed)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl hover:bg-primary-50 dark:hover:bg-darkAccent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {revealed ? <TbEyeOff size={20} /> : <TbEye size={20} />}
          </button>
        )}
      </div>
      <dd className={"select-text break-words whitespace-pre-wrap text-sm " + (sensitive || monospace ? "font-mono" : "")}>
        {sensitive && !revealed ? "••••••••••••" : text}
      </dd>
    </div>
  );
}

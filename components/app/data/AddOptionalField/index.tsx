// AddOptionalField: "+ Add field" button with dropdown. Shows remaining optional fields.
// Does NOT handle rendering the added fields — only the add trigger.

"use client";
import { useState, useRef, useEffect } from "react";
import { TbPlus } from "react-icons/tb";

interface OptionalField {
  key: string;
  label: string;
}

interface AddOptionalFieldProps {
  fields: OptionalField[];
  onAdd: (key: string) => void;
}

export default function AddOptionalField({
  fields,
  onAdd,
}: AddOptionalFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  if (fields.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 border border-dashed border-default rounded-md p-2 w-full justify-center"
        onClick={() => setOpen(!open)}
      >
        <TbPlus size={16} />
        Add field
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-secondary border border-default rounded-md shadow-md z-10">
          {fields.map((f) => (
            <button
              key={f.key}
              type="button"
              className="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => {
                onAdd(f.key);
                setOpen(false);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Tag list input: split an input by a separator, add chips, remove chips.
// Owns: input value, add/remove UI, de-duplication. Does NOT own data state — caller wires onChange.
"use client";
import { useRef } from "react";
import { TbTrash } from "react-icons/tb";

interface TagListFieldProps {
  id: string;
  label: string;
  placeholder: string;
  values: string[];
  splitBy: string;
  onChange: (values: string[]) => void;
  emptyMessage?: string;
}

export default function TagListField({
  id,
  label,
  placeholder,
  values,
  splitBy,
  onChange,
  emptyMessage = "None",
}: TagListFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function add() {
    const raw = inputRef.current?.value ?? "";
    const parts = raw
      .split(splitBy)
      .map((p) => p.trim())
      .filter((p) => p !== "");
    if (parts.length === 0) return;
    onChange(Array.from(new Set([...(values || []), ...parts])));
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(value: string) {
    onChange((values || []).filter((v) => v !== value));
  }

  return (
    <>
      <div className="font-semibold">{label}</div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          id={id}
          className="bg-secondary border border-default rounded-xl p-2 w-full"
          type="text"
          placeholder={placeholder}
        />
        <button
          type="button"
          className="bg-secondary border border-default rounded-xl p-2"
          onClick={add}
        >
          Add
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {(!values || values.length === 0) && (
          <div className="text-sm font-semibold text-neutral-500">{emptyMessage}</div>
        )}
        {values?.map((value) => (
          <div
            key={value}
            className="flex items-center gap-2 border border-default rounded-xl p-2"
          >
            <div>{value}</div>
            <button type="button" onClick={() => remove(value)}>
              <TbTrash />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

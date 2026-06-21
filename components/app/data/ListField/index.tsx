// ListField: Reusable list/array input section. Label + add input + chip list.
// Used for websites, backup codes, alias emails, seed phrases.

"use client";
import { useState, ReactNode } from "react";
import { TbTrash } from "react-icons/tb";

interface ListFieldProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  onRemove?: () => void;
  placeholder?: string;
  separator?: string;
  emptyMessage?: string;
  required?: boolean;
  children?: ReactNode;
  formatItem?: (item: string, index: number) => ReactNode;
}

export default function ListField({
  label,
  items,
  onChange,
  onRemove,
  placeholder,
  separator = ",",
  emptyMessage = "No items",
  required,
  children,
  formatItem,
}: ListFieldProps) {
  const [input, setInput] = useState("");

  const addItems = () => {
    const newItems = input
      .split(separator)
      .map((s) => s.trim())
      .filter((s) => s !== "");
    if (newItems.length === 0) return;
    onChange([...new Set([...items, ...newItems])]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItems();
    }
  };

  const removeItem = (item: string) => {
    onChange(items.filter((i) => i !== item));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-2">
          {required && (
            <span className="text-xs text-neutral-500">Required</span>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-neutral-500 hover:text-red-500"
            >
              <TbTrash size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          className="bg-secondary border border-default rounded-md p-2 w-full"
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="bg-secondary border border-default rounded-md p-2 shrink-0"
          onClick={addItems}
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {items.length === 0 && (
          <div className="text-sm font-semibold text-neutral-500">
            {emptyMessage}
          </div>
        )}
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 border border-default rounded-md p-2"
          >
            <div>
              {formatItem ? formatItem(item, index) : item}
            </div>
            <button type="button" onClick={() => removeItem(item)}>
              <TbTrash />
            </button>
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}

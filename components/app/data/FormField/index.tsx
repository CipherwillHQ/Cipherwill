// FormField: Labeled input wrapper. Handles text, email, password (with reveal), textarea.
// Does NOT handle list/array fields.

"use client";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";

interface FormFieldProps {
  label: string;
  type?: "text" | "email" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  sensitive?: boolean;
  onRemove?: () => void;
}

const inputClasses =
  "bg-secondary border border-default rounded-md p-2 w-full";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  sensitive,
  onRemove,
}: FormFieldProps) {
  const [show, setShow] = useState(false);
  const resolvedType = sensitive ? (show ? "text" : "password") : type;

  const field =
    type === "textarea" ? (
      <textarea
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <input
        className={inputClasses}
        type={resolvedType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );

  return (
    <div className="flex flex-col gap-1">
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
      {sensitive ? (
        <div className="flex items-center gap-2">
          {field}
          <div
            onClick={() => setShow((e) => !e)}
            className="cursor-pointer shrink-0"
          >
            {show ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
          </div>
        </div>
      ) : (
        field
      )}
    </div>
  );
}

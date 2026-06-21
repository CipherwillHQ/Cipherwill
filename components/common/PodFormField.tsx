// Renders a single form field (text, password with toggle, or textarea) with label above.
// Owns: password show/hide toggle. Does NOT own form state, validation, or dirty tracking.
"use client";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface PodFormFieldProps {
  label: string;
  type?: "text" | "password" | "textarea";
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const inputClasses =
  "w-full min-h-[44px] px-3 py-2 rounded-xl bg-secondary border border-default text-forest dark:text-cream placeholder:text-neutral-400 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none";

export default function PodFormField({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
}: PodFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-forest dark:text-cream">
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          className={`${inputClasses} min-h-[80px]`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : type === "password" ? (
        <div className="relative">
          <input
            className={`${inputClasses} pr-10`}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            onClick={() => setShowPassword((e) => !e)}
          >
            {showPassword ? <BsEyeSlash size={18} /> : <BsEye size={18} />}
          </button>
        </div>
      ) : (
        <input
          className={inputClasses}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

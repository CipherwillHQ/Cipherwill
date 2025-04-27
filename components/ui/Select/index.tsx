import { twMerge } from "tailwind-merge";

export default function Select({
  options = [],
  placeholder = "Select an option",
  className = "",
  defaultValue = "",
  value = "",
  onChange = () => {},
  disabled = false,
}: {
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (item: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      defaultValue={value ? undefined : defaultValue}
      value={value || undefined}
      className={`${twMerge(
        "border text-black dark:text-white bg-white dark:bg-dark border-default p-2 rounded-md",
        className
      )} minimal customScrollbar`}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => {
        return (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
}

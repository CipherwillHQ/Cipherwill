import type { ButtonHTMLAttributes, ReactNode } from "react";

type GuidedButtonVariant = "primary" | "secondary";

interface GuidedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: GuidedButtonVariant;
}

function getVariantClasses(variant: GuidedButtonVariant, disabled: boolean) {
  if (disabled) {
    return "bg-black/8 text-black/40 border-black/10 dark:bg-white/10 dark:text-white/45 dark:border-white/15 cursor-not-allowed";
  }

  if (variant === "secondary") {
    return "bg-transparent text-black/80 border-black/25 hover:bg-black/5 dark:text-white/85 dark:border-white/30 dark:hover:bg-white/10";
  }

  return "bg-black text-white border-black hover:opacity-90 dark:bg-white dark:text-black dark:border-white";
}

export default function GuidedButton({
  children,
  variant = "primary",
  disabled = false,
  className = "",
  ...rest
}: GuidedButtonProps) {
  const variantClasses = getVariantClasses(variant, Boolean(disabled));

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex min-h-11 items-center justify-center rounded-xl border px-5 py-2.5 text-sm md:text-base font-semibold tracking-[0.01em] transition-all duration-200 cursor-pointer ${variantClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

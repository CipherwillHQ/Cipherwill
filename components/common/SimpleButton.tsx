import Link from "next/link";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "danger";

export default function SimpleButton({
  className,
  link_className,
  disabled,
  onClick,
  children,
  href = null,
  variant = "primary",
}: {
  className?: string;
  link_className?: string;
  disabled?: boolean;
  onClick?: (event) => void;
  children: React.ReactNode;
  href?: string | null;
  variant?: ButtonVariant;
}) {
  // Define styles for different button variants
  const getVariantStyles = (variant: ButtonVariant) => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-primary-700 to-primary text-white hover:from-primary-800 hover:to-primary-600";
      case "secondary":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300";
      case "danger":
        return "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600";
      default:
        return "bg-gradient-to-r from-primary-700 to-primary text-white hover:from-primary-800 hover:to-primary-600";
    }
  };

  const button = (
    <button
      className={twMerge(
        "flex flex-row items-center justify-center rounded-md px-4 py-1 transition-colors duration-200 hover:cursor-pointer",
        getVariantStyles(variant),
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );

  if (href) {
    if(disabled) {
      return (
        <span className={link_className}>
          {button}
        </span>
      );
    }
    return (
      <Link href={href} className={link_className}>
        {button}
      </Link>
    );
  }

  return button;
}

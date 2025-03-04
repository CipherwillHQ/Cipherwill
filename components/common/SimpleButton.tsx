import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function SimpleButton({
  className,
  link_className,
  onClick,
  children,
  href = null,
}: {
  className?: string;
  link_className?: string;
  onClick?: (event) => void;
  children: React.ReactNode;
  href?: string;
}) {
  const button = (
    <button
      className={twMerge(
        "rounded-md px-4 py-1 bg-gradient-to-r from-primary-700 to-primary text-white",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );

  if (href) {
    return (
      <Link href={href} className={link_className}>
        {button}
      </Link>
    );
  }

  return button;
}

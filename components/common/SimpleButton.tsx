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
        "rounded-md px-4 py-1 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-300 text-white dark:text-black transition-colors duration-300",
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

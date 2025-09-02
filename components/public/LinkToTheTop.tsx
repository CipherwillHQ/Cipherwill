"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LinkToTheTop({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === href) {
      // If the current pathname matches the link's href, scroll to the top
      window.scrollTo(0, 0);
    }
  }, [pathname, href]);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );

  return (
    <button
      className={`hover:cursor-pointer ${className}`}
      onClick={() => {
        window.location.assign(href);
      }}
    >
      {children}
    </button>
  );
}

import whiteLogo from "@/assets/logo-white.png";
import blackLogo from "@/assets/logo-black.png";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
export default function SymbolicLogo({
  overrideTheme = null,
  className = "",
  size = 100,
}: {
  overrideTheme?: "dark" | "light";
  className?: string;
  size?: number;
}) {
  if (overrideTheme === "dark") {
    return (
      <Image
        src={whiteLogo}
        alt="Cipherwill logo"
        width={size}
        className={className}
        height={size}
        priority
      />
    );
  }

  if (overrideTheme === "light") {
    return (
      <Image
        src={blackLogo}
        alt="Cipherwill logo"
        width={size}
        height={size}
        className={className}
        priority
      />
    );
  }
  return (
    <>
      <Image
        src={blackLogo}
        alt="Cipherwill logo"
        width={size}
        height={size}
        className={twMerge("dark:hidden", className)}
        priority
      />
      <Image
        src={whiteLogo}
        alt="Cipherwill logo"
        width={size}
        height={size}
        className={twMerge("hidden dark:block", className)}
        priority
      />
    </>
  );
}

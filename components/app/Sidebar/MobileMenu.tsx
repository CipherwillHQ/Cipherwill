"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GrAppsRounded,
  GrCommand,
  GrGroup,
  GrHomeRounded,
  GrResources,
} from "react-icons/gr";
import { TbColorSwatch } from "react-icons/tb";
import MobileFloatingMenu from "./MobileFloatingMenu";

export default function MobileMenu({ home = false }: { home?: boolean }) {
  const pathname = usePathname();
  return (
    <div className="sm:hidden fixed bottom-0 border-t border-default p-2 w-screen bg-secondary">
      <div className="flex items-center justify-between px-4">
        {pathname === "/app" ? (
          <button
            className={`flex flex-col items-center justify-center text-accent-500 px-2`}
            onClick={() => {
              // mobile-menu-btn
              document.getElementById("mobile-menu-btn")?.click();
            }}
          >
            <GrAppsRounded size={23} />
            <div className="font-semibold text-sm">Home</div>
          </button>
        ) : (
          <Link href="/app" className="px-2">
            <button className={`flex flex-col items-center justify-center`}>
              <GrAppsRounded size={23} />
              <div className="font-semibold text-sm">Home</div>
            </button>
          </Link>
        )}
        <Link href="/app/data" className="px-2">
          <button
            className={`flex flex-col items-center justify-center ${
              pathname === "/app/data" ? "text-accent-500" : ""
            }`}
          >
            <GrResources size={23} />
            <div className="font-semibold text-sm">Data</div>
          </button>
        </Link>
        <Link href="/app/network" className="px-2">
          <button
            className={`flex flex-col items-center justify-center ${
              pathname === "/app/network" ? "text-accent-500" : ""
            }`}
          >
            <GrGroup size={23} />
            <div className="font-semibold text-sm">Network</div>
          </button>
        </Link>
        <Link href="/app/platform" className="px-2">
          <button
            className={`flex flex-col items-center justify-center ${
              pathname === "/app/platform" ? "text-accent-500" : ""
            }`}
          >
            <TbColorSwatch size={23} />
            <div className="font-semibold text-sm">Platform</div>
          </button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import logoBlack from "../../assets/name-black.png";
import { useAuth } from "@/contexts/AuthContext";
import menu from "./menu";
import MobileHeader from "./MobileHeader";
import { twMerge } from "tailwind-merge";
import { WorksMenuDesktop } from "./WorksMenu";

export default function Header({
  classOverride = "",
  backdropClassOverride = "",
  nonExpandedClassOverride = "",
  expandedClassOverride = "",
}: {
  classOverride?: string;
  backdropClassOverride?: string;
  nonExpandedClassOverride?: string;
  expandedClassOverride?: string;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [hoverMenu, setHoverMenu] = useState(null);

  const handleScroll = () => {
    const position = window.scrollY;
    if (position > 1) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={twMerge(
        `fixed z-50 mx-auto w-full left-0 right-0 top-0 text-black
          ${
            expanded
              ? twMerge(
                  `h-16 bg-black/5 dark:bg-white/5 backdrop-blur-md`,
                  expandedClassOverride
                )
              : twMerge(`h-20`, nonExpandedClassOverride)
          } transition-all ease-in-out duration-500`,
        classOverride
      )}
    >
      {/* Important to switch theme in the middle of the page */}
      {/* <span className="absolute top-0 opacity-0 h-0 w-0 overflow-hidden">
          {final_state}
        </span> */}

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-full px-4">
        <Link href="/" className="flex items-center">
          <Image
            id="header-logo"
            data-cy="logo"
            alt={`cipherwill logo`}
            src={
              // final_state === "dark" ? logoWhite :
              logoBlack
            }
            width={150}
            height={100}
            priority
          />
        </Link>

        <div className="hidden sm:flex items-center gap-3 -ml-6">
          {menu.map((item) => {
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`mx-1 hover:text-neutral-500 p-1 font-medium
                  ${
                    pathname === item.path &&
                    "underline decoration-2 underline-offset-8 decoration-orange-500"
                  }
                  content-center ${expanded ? "h-16" : "h-20"}
                  `}
                  onMouseEnter={() => {
                    if (item.desktop_hover) {
                      setHoverMenu(item.desktop_hover);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.desktop_hover) {
                      setHoverMenu(null);
                    }
                  }}
                >
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center">
          <Link href="/app">
            <div
              className={`
              ${
                // final_state === "dark"
                //   ? "bg-white text-black":
                "bg-black text-white"
              }
              font-semibold transition-colors duration-300 px-4 py-2 rounded-full text-xs m-2`}
            >
              <div className="mt-[1px] sm:mt-0">
                {user ? "Dashboard" : "Login/Signup"}
              </div>
            </div>
          </Link>
          <MobileHeader />
        </div>
      </div>

      <div
        className={`w-fit max-w-7xl mx-auto overflow-hidden ${
          hoverMenu !== null
            ? "h-fit p-2 border rounded-md bg-white shadow-lg backdrop-blur-md"
            : "h-0"
        }`}
        onMouseEnter={() => {
          setHoverMenu(hoverMenu);
        }}
        onMouseLeave={() => {
          setHoverMenu(null);
        }}
        onClick={() => {
          setHoverMenu(null);
        }}
      >
        {hoverMenu}
        {/* <WorksMenuDesktop /> */}
      </div>
    </header>
  );
}

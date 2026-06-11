/**
 * Main public Header component for Cipherwill.
 * Owns the desktop navigation bar, scrolled/unscrolled header styling, and the hover dropdown container.
 * Does NOT own the sidebar navigation for dashboard/executor layouts.
 */

"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import logoBlack from "../../assets/name-black.png";
import logoWhite from "../../assets/name-white.png";
import { useAuth } from "@/contexts/AuthContext";
import menu from "./menu";
import MobileHeader from "./MobileHeader";
import { twMerge } from "tailwind-merge";
import LinkToTheTop from "../public/LinkToTheTop";

export default function Header({
  classOverride = "",
  backdropClassOverride = "",
  nonExpandedClassOverride = "",
  expandedClassOverride = "",
  nonExpandedLogo = "black",
  expandedLogo = "black",
}: {
  classOverride?: string;
  backdropClassOverride?: string;
  nonExpandedClassOverride?: string;
  expandedClassOverride?: string;
  nonExpandedLogo?: string;
  expandedLogo?: string;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [hoverMenu, setHoverMenu] = useState<any | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterLink = (menuContent: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoverMenu(menuContent);
  };

  const handleMouseLeaveLink = () => {
    timeoutRef.current = setTimeout(() => {
      setHoverMenu(null);
    }, 150);
  };

  const handleMouseEnterDropdown = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeaveDropdown = () => {
    timeoutRef.current = setTimeout(() => {
      setHoverMenu(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
        `fixed z-50 mx-auto w-full left-0 right-0 top-0 text-forest
          ${
            expanded
              ? twMerge(
                  `h-16 bg-cream/80 backdrop-blur-md border-b border-default`,
                  expandedClassOverride
                )
              : twMerge(`h-20`, nonExpandedClassOverride)
          } transition-all ease-cw-ease duration-500`,
        classOverride
      )}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-full px-4">
        <LinkToTheTop href="/" className="flex items-center">
          <Image
            id="header-logo"
            data-cy="logo"
            alt={`cipherwill logo`}
            src={
              expanded
                ? expandedLogo === "black"
                  ? logoBlack
                  : logoWhite
                : nonExpandedLogo === "black"
                ? logoBlack
                : logoWhite
            }
            width={150}
            height={100}
            priority
            suppressHydrationWarning
          />
        </LinkToTheTop>

        <div className="hidden sm:flex items-center gap-3 -ml-6">
          {menu.map((item) => {
            return (
              <LinkToTheTop key={item.path} href={item.path}>
                <div
                  className={`mx-1 text-forest/80 hover:text-primary p-1 font-medium transition-colors duration-200 cursor-pointer
                  ${pathname === item.path ? "text-primary font-semibold" : ""}
                  content-center ${expanded ? "h-16" : "h-20"}
                  `}
                  onMouseEnter={() => {
                    if (item.desktop_hover) {
                      handleMouseEnterLink(item.desktop_hover);
                    } else {
                      handleMouseEnterLink(null);
                    }
                  }}
                  onMouseLeave={() => {
                    handleMouseLeaveLink();
                  }}
                >
                  {item.title}
                </div>
              </LinkToTheTop>
            );
          })}
        </div>
        <div className="flex items-center">
          <LinkToTheTop href="/app">
            <div
              className="bg-linear-to-r from-primary-700 to-primary text-white font-semibold shadow-sm hover:shadow-level-1 active:scale-[0.98] transition-all duration-200 ease-cw-ease px-5 py-2 rounded-xl text-sm m-2 cursor-pointer"
            >
              <div className="mt-[1px] sm:mt-0">
                {user ? "Dashboard" : "Login/Signup"}
              </div>
            </div>
          </LinkToTheTop>
          <MobileHeader />
        </div>
      </div>

      <div
        className={`absolute left-1/2 -translate-x-1/2 mt-2 w-fit max-w-7xl mx-auto overflow-hidden transition-all duration-300 ease-cw-ease border border-default rounded-2xl bg-white shadow-level-1
          ${
            hoverMenu !== null
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto p-4 visible"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none h-0 p-0 invisible"
          }
        `}
        onMouseEnter={() => {
          handleMouseEnterDropdown();
        }}
        onMouseLeave={() => {
          handleMouseLeaveDropdown();
        }}
        onClick={() => {
          setHoverMenu(null);
        }}
      >
        {hoverMenu}
      </div>
    </header>
  );
}

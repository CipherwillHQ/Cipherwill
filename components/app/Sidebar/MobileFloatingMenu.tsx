"use client";
import { useState } from "react";
import SidebarLogo from "./SidebarLogo";
import SidebarPanel from "./SidebarPanel";
import { GiHamburgerMenu } from "react-icons/gi";

export default function MobileFloatingMenu() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        id="mobile-menu-btn"
        className="sm:hidden flex items-center gap-2 justify-center"
        onClick={() => {
          setOpen(true);
        }}
      >
        <GiHamburgerMenu size={25} />
      </button>

      <div
        className={`fixed backdrop-blur-xs top-0 left-0 bottom-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out  
  ${open ? "w-full" : "w-0"}
  `}
        onClick={(e) => {
          setOpen(false);
        }}
      >
        <div
          className={`flex h-full w-[280px] max-w-[85vw] flex-col border-r border-default bg-secondary px-2 shadow-2xl overflow-y-auto`}
          style={{
            paddingTop: "calc(var(--cw-safe-top) + 0.25rem)",
            paddingBottom: "calc(var(--cw-safe-bottom) + 0.5rem)",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <SidebarLogo />
          <SidebarPanel />
        </div>
      </div>
    </>
  );
}

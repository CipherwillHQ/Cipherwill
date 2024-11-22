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
        className={`absolute backdrop-blur-sm top-0 left-0 bottom-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out  
  ${open ? "w-full" : "w-0"}
  `}
        onClick={(e) => {
          setOpen(false);
        }}
      >
        <div
          className={` flex flex-col bg-secondary border-r border-default h-screen w-[280px] px-2 pb-2 shadow-2xl`}
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

// What it does: Renders the circular profile avatar button and account popup menu.
// What it owns: Navigation links to profile settings and home, plus the logout action.
// What it does NOT do: Manage authentication state or render page titles.
"use client";

import Link from "next/link";
import Popup from "reactjs-popup";
import { AiOutlineUser } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePopup() {
  const { logout } = useAuth();
  return (
    <Popup
      trigger={
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 hover:cursor-pointer"
        >
          <AiOutlineUser size={24} />
        </button>
      }
      position="bottom right"
    >
      <div className="bg-white dark:bg-neutral-800 dark:text-white rounded-md flex flex-col p-1 gap-1">
        <Link
          href={`/app/settings?tab=profile`}
          className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className="mr-2 text-xl">
            <AiOutlineUser />
          </div>
          <div className="text-sm font-medium">Profile</div>
        </Link>
        <Link
          href={`/`}
          className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className="mr-2 text-xl">
            <IoHomeOutline />
          </div>
          <div className="text-sm font-medium">Home page</div>
        </Link>
        <div
          data-cy="logout-btn"
          onClick={() => {
            logout();
          }}
          className="flex items-center p-2 rounded-md justify-start cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className="mr-2 text-xl">
            <TbLogout />
          </div>
          <div className="text-sm font-medium">Logout</div>
        </div>
      </div>
    </Popup>
  );
}

/**
 * Topbar/index.tsx
 * What it does: Renders the dashboard's top navigation bar, including title, mobile menu trigger, compact user score pill, and user profile popup.
 * What it owns: Layout and presentation of header level items.
 * What it does NOT do: Does not manage global navigation routes or user authentication logic directly (delegated to Link and useAuth).
 */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { TbLogout } from "react-icons/tb";
import Popup from "reactjs-popup";
import MobileFloatingMenu from "../Sidebar/MobileFloatingMenu";
import { AiOutlineUser } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import UserScore from "@/app/app/score/UserScore";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <MobileFloatingMenu />
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <UserScore variant="compact" />
        <ProfilePopup />
      </div>
    </div>
  );
}

function ProfilePopup() {
  const { logout } = useAuth();
  return (
    <Popup
      trigger={
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 hover:cursor-pointer">
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
          <div className={`mr-2 text-xl`}>
            <AiOutlineUser />
          </div>
          <div className={`text-sm font-medium`}>Profile</div>
        </Link>
        <Link
          href={`/`}
          className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className={`mr-2 text-xl`}>
            <IoHomeOutline />
          </div>
          <div className={`text-sm font-medium`}>Home page</div>
        </Link>
        <div
          data-cy="logout-btn"
          onClick={() => {
            logout();
          }}
          className="flex items-center p-2 rounded-md justify-start cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className={`mr-2 text-xl`}>
            <TbLogout />
          </div>
          <div className={`text-sm font-medium`}>Logout</div>
        </div>
      </div>
    </Popup>
  );
}

"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { LuHome } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";
import Popup from "reactjs-popup";
import MobileFloatingMenu from "../Sidebar/MobileFloatingMenu";
import { AiOutlineUser } from "react-icons/ai";

export default function Topbar() {
  const { logout } = useAuth();
  return (
    <div className="flex items-center justify-between p-4">
      <MobileFloatingMenu/>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <ProfilePopup />
    </div>
  );
}

function ProfilePopup() {
  const { logout } = useAuth();
  return (
    <Popup
      trigger={
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100">
          <AiOutlineUser size={24} />
        </button>
      }
      position="bottom right"
    >
      <div className="bg-white dark:bg-neutral-800 dark:text-white rounded-md flex flex-col p-1 gap-1">
        <Link
          href={`/app/profile`}
          className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className={`mr-2 text-xl`}>
            <AiOutlineUser  />
          </div>
          <div className={`text-sm font-medium`}>Profile</div>
        </Link>
        <Link
          href={`/`}
          className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className={`mr-2 text-xl`}>
            <LuHome />
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

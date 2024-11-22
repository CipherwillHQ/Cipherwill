"use client";
import truncateString from "@/common/string/truncateString";
import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserSetupContext";
import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { LuHome, LuUser2 } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";
import Popup from "reactjs-popup";
import SidebarItem from "../app/Sidebar/SidebarItem";
import SwitchThemeButton from "../app/Sidebar/SwitchThemeButton";

export default function UserFlag() {
  const { user } = useUserContext();
  const { logout } = useAuth();
  if (!user)
    return (
      <div className="bg-neutral-500/5 animate-pulse p-1 rounded-md h-8" />
    );

  return (
    <Popup
      trigger={
        <div>
          <SidebarItem
            icon={<FaRegUserCircle />}
            title={truncateString(
              user.first_name ? user.first_name : user.email,
              10
            )}
            trailing_element={<FaAngleRight />}
          />
        </div>
      }
      position={"top center"}
    >
      <div className="bg-secondary w-64 text-black dark:text-white border border-default p-2 shadow-lg rounded-md">
        <div className="flex flex-col gap-2 border-b border-default pb-2">
          <div className="font-semibold opacity-75">Signed in as</div>
          <Link href={`/app/profile`}>
            <div className="flex items-start gap-2 max-w-64">
              <div className="bg-accent-500 mt-1 h-8 w-8 min-h-8 min-w-8 rounded-full flex items-center justify-center">
                {(user.first_name
                  ? user.first_name.substring(0, 1)
                  : user.email.substring(0, 1)
                ).toUpperCase()}
              </div>
              <div className="text-sm flex flex-col flex-1 max-w-60">
                <div>{user.first_name || "No name provided"}</div>
                <div className="whitespace-pre-wrap break-words">
                  {user.email}
                </div>{" "}
              </div>
            </div>
          </Link>
        </div>
        <Link
          href={`/app/profile`}
          className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className={`mr-2 text-xl`}>
            <LuUser2 />
          </div>
          <div className={`font-medium text-sm`}>Profile</div>
        </Link>
        <Link
          href={`/`}
          className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <div className={`mr-2 text-xl`}>
            <LuHome />
          </div>
          <div className={`font-medium text-sm`}>Home page</div>
        </Link>
        <SwitchThemeButton />
        <div className="border-t border-default pt-2">
          <div
            onClick={() => {
              logout();
            }}
            className="flex items-center p-2 rounded-md justify-start cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <div className={`mr-2 text-xl`}>
              <TbLogout size={21} />
            </div>
            <div className={`font-medium text-sm`}>Logout</div>
          </div>
        </div>
      </div>
    </Popup>
  );
}

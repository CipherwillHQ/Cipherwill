"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import getExecutorMenu from "./getExecutorMenu";
import DonorName from "./DonorName";
import SidebarLogo from "../../app/Sidebar/SidebarLogo";
import SwitchThemeButton from "@/components/app/Sidebar/SwitchThemeButton";

export default function ExecutorSidebar() {
  const pathname = usePathname();
  const exeutorId = pathname.split("/")[2];

  return (
    <div className="flex flex-col h-full w-min sm:w-60 justify-between bg-white dark:bg-dark p-1 sm:p-2 border-r border-default">
      <div>
        <SidebarLogo />

        <div className="w-full flex flex-1 flex-col overflow-auto">
          {getExecutorMenu(pathname).map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={`divider-${index}`}
                  className="border-t border-gray-300 mx-1 my-2"
                />
              );
            }
            if (item.donor) {
              return (
                <div
                  key={`donor-${index}`}
                  className="p-1 text-xs sm:text-base text-center"
                >
                  Data of <DonorName access_id={exeutorId} />
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                href={item.path}
                data-cy={`executor-sidebar-${item.title}`}
              >
                <div
                  className={`flex items-center m-1 p-2 rounded-md justify-center sm:justify-start  
                 ${
                   item.path === pathname
                     ? "font-semibold"
                     : "hover:underline"
                 }
             `}
                >
                  <div className={`sm:mr-2 text-2xl sm:text-xl`}>
                    {item.icon}
                  </div>
                  <div className={`text-sm hidden sm:flex`}>{item.title}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <SwitchThemeButton />
    </div>
  );
}

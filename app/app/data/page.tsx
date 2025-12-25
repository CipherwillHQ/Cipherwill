'use client';
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import MobileMenu from "@/components/app/Sidebar/MobileMenu";
import Link from "next/link";
import menu from "@/components/app/Sidebar/menu";
import { useUserContext } from "@/contexts/UserSetupContext";

function get_filtered_menu(menu) {
  let start_return = false;
  return menu.filter((item, index) => {
    if (item.divider === "Data") {
      start_return = true;
      return true;
    }
    if (item.divider === "Network") {
      start_return = false;
      return false;
    }
    if (start_return) {
      return true;
    }else{
      return false;
    }
  })
}

export default function Data() {
  // get menu after data dividor and before network divider
  const filtered_menu  = get_filtered_menu(menu);
  const { preferences } = useUserContext();

  return (
    <div className="w-full">
      <MobileMenu/>
      <DesktopAndMobilePageHeader title="Manage Data" />
      <div className="py-4 px-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered_menu.map((item, index) => {
            if (item.divider) {
              // if all segments are disabled then don't show the divider
              if (
                item.segment_group &&
                item.segment_group.every((segment_key) => {
                  return !preferences[segment_key];
                })
              ) {
                return null;
              }
              return (
                <div
                  key={index}
                  className="col-span-2 sm:col-span-3 md:col-span-4 pt-2"
                >
                  <div className="text-black/80 dark:text-white font-medium">{item.divider}</div>
                </div>
              );
            }
            if (
              item.preference_key &&
              preferences[item.preference_key] === false
            ) {
              return null;
            }
            return (
              <Link
                key={index}
                href={item.path}
                className="border border-default rounded-lg bg-secondary hover:bg-secondary/80 transition-colors w-full h-32 flex flex-col items-center justify-center gap-2 p-4 text-center"
              >
                <div className="text-2xl">
                  {item.icon}
                </div>
                <div className="text-sm font-medium line-clamp-2">
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

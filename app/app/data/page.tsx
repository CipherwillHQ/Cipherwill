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
      <div className="flex flex-col py-4 px-4 gap-2">
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
                className="flex basis-[100%]"
              >
                <div className="text-black/80 dark:text-white">{item.divider}</div>
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
            <div key={index} className="border border-default p-2 rounded-md bg-secondary max-w-sm">
              <Link
                href={item.path}
                className="flex items-center gap-2"
              >
                {item.icon}
                {item.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import menu from "./menu";
import { TbLock } from "react-icons/tb";
import SwitchThemeButton from "./SwitchThemeButton";
import { usePathname } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import PremiumFlag from "@/components/common/PremiumFlag";
import SidebarItem from "./SidebarItem";
import { useUserContext } from "@/contexts/UserSetupContext";
import DevOnly from "@/components/debug/DevOnly";
import UserFlag from "@/components/common/UserFlag";
import { Divider, Segment } from "@/types/Segments";
import LiveChatBox from "../LiveChatBox";

export default function SidebarPanel() {
  const pathname = usePathname();
  const { lock, session } = useSession();
  const { preferences } = useUserContext();

  return (
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <div className="w-full flex flex-1 flex-col pb-20 overflow-auto customScrollbar">
        {menu.map((item, index) => {
          if ((item as Divider).divider) {
            // if all segments are disabled then don't show the divider
            if (
              (item as Divider).segment_group &&
              (item as Divider).segment_group?.every((segment_key) => {
                return !preferences[segment_key];
              })
            ) {
              return null;
            }
            return (
              <div
                key={`divider-${index}`}
                className="text-sm text-neutral-700 dark:text-neutral-300 font-semibold mt-3 px-2 py-1"
              >
                {(item as Divider).path ? (
                  <Link href={(item as Divider).path ?? ""}>
                    {(item as Divider).divider}
                  </Link>
                ) : (
                  (item as Divider).divider
                )}
              </div>
            );
          }
          if (
            (item as Segment).preference_key &&
            (preferences[(item as Segment).preference_key as string] === undefined ||
              preferences[(item as Segment).preference_key as string] === false)
          ) {
            return null;
          }
          return (
            <Link
              key={(item as Segment).path}
              href={(item as Segment).path}
              data-cy={`${(item as Segment).path}-nav-link`}
            >
              <div
                className={`rounded-md
              ${
                (
                  (item as Segment).path === "/app"
                    ? (item as Segment).path === pathname
                    : pathname?.startsWith((item as Segment).path)
                )
                  ? "bg-slate-100 dark:bg-slate-800 border-l-4 border-black dark:border-white"
                  : ""
              }
          `}
              >
                <SidebarItem
                  icon={(item as Segment).icon}
                  title={(item as Segment).title}
                />
              </div>
            </Link>
          );
        })}

        <LiveChatBox />
      </div>

      <div className="pt-1 border-t border-default">
        {session && session.privateKey && (
          <div
            onClick={() => {
              lock();
            }}
            className="dark:hover:text-black cursor-pointer hover:bg-orange-100 active:bg-orange-200"
          >
            <SidebarItem icon={<TbLock />} title="Lock" />
          </div>
        )}
        <PremiumFlag />
        <UserFlag />
        <DevOnly>
          <SwitchThemeButton />
        </DevOnly>
      </div>
    </div>
  );
}

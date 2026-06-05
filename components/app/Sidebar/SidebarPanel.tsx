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
import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

export default function SidebarPanel() {
  const pathname = usePathname();
  const { lock, session } = useSession();
  const { preferences } = useUserContext();
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const [activeSelection, setActiveSelection] = useState<{
    top: number;
    height: number;
    ready: boolean;
  }>({
    top: 0,
    height: 0,
    ready: false,
  });

  useLayoutEffect(() => {
    const updateActiveSelection = () => {
      const menuContainer = menuItemsRef.current;
      if (!menuContainer) return;

      const activeElement = menuContainer.querySelector(
        "[data-sidebar-active='true']",
      ) as HTMLDivElement | null;

      if (!activeElement) {
        setActiveSelection((prev) => ({ ...prev, ready: false }));
        return;
      }

      setActiveSelection({
        top: activeElement.offsetTop,
        height: activeElement.offsetHeight,
        ready: true,
      });
    };

    updateActiveSelection();
    window.addEventListener("resize", updateActiveSelection);

    return () => {
      window.removeEventListener("resize", updateActiveSelection);
    };
  }, [pathname, preferences]);

  return (
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <div className="w-full flex flex-1 flex-col pb-20 overflow-auto customScrollbar">
        <div ref={menuItemsRef} className="relative">
          {activeSelection.ready && (
            <motion.div
              className="absolute left-0 right-0 rounded-md bg-slate-100 dark:bg-slate-800 border-l-4 border-black dark:border-white pointer-events-none"
              initial={false}
              animate={{
                y: activeSelection.top,
                height: activeSelection.height,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 28,
                mass: 0.8,
              }}
            />
          )}
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
              (preferences[(item as Segment).preference_key as string] ===
                undefined ||
                preferences[(item as Segment).preference_key as string] === false)
            ) {
              return null;
            }
            const isActive =
              (item as Segment).path === "/app"
                ? (item as Segment).path === pathname
                : pathname?.startsWith((item as Segment).path);
            return (
              <Link
                key={(item as Segment).path}
                href={(item as Segment).path}
                data-cy={`${(item as Segment).path}-nav-link`}
                onClick={(e) => {
                  const currentItem = e.currentTarget.querySelector(
                    "[data-sidebar-item='true']",
                  ) as HTMLDivElement | null;
                  if (!currentItem) return;
                  setActiveSelection({
                    top: currentItem.offsetTop,
                    height: currentItem.offsetHeight,
                    ready: true,
                  });
                }}
              >
                <div
                  data-sidebar-active={isActive ? "true" : "false"}
                  data-sidebar-item="true"
                  className="relative z-10 rounded-md overflow-hidden"
                >
                  <SidebarItem
                    icon={(item as Segment).icon}
                    title={(item as Segment).title}
                  />
                </div>
              </Link>
            );
          })}
        </div>

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

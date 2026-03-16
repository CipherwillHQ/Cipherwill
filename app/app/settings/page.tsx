"use client";

import { useEffect, useState } from "react";
import ApplicationSettings from "./ApplicationSettings";
import DevOnly from "../../../components/debug/DevOnly";
import WillEvents from "./WillEvents";
import DefaultSettings from "./DefaultSettings";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import ApplicationUsage from "./ApplicationUsage";
import ProfileSettingsTab from "./ProfileSettingsTab";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BackupPanel from "../backup/BackupPanel";

type SettingsTab =
  | "DEFAULT"
  | "PROFILE"
  | "BACKUP"
  | "USAGE"
  | "APPLICATION"
  | "WILL_EVENTS";

const TAB_QUERY_TO_TAB: Record<string, SettingsTab> = {
  settings: "DEFAULT",
  general: "DEFAULT",
  profile: "PROFILE",
  backup: "BACKUP",
  usage: "USAGE",
  application: "APPLICATION",
  "will-events": "WILL_EVENTS",
};

const TAB_TO_QUERY: Record<SettingsTab, string> = {
  DEFAULT: "general",
  PROFILE: "profile",
  BACKUP: "backup",
  USAGE: "usage",
  APPLICATION: "application",
  WILL_EVENTS: "will-events",
};

export default function Settings() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<SettingsTab>("DEFAULT");

  useEffect(() => {
    const requestedTab = searchParams?.get("tab")?.toLowerCase() || "general";
    setTab(TAB_QUERY_TO_TAB[requestedTab] || "DEFAULT");
  }, [searchParams]);

  const changeTab = (nextTab: SettingsTab) => {
    setTab(nextTab);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("tab", TAB_TO_QUERY[nextTab]);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Settings" />

      <div className="">
        <div className="flex items-center p-2">
          <button
            className={`mx-2 hover:cursor-pointer
          ${tab === "DEFAULT" && "border-b-2 border-accent-500"}
          `}
            onClick={() => changeTab("DEFAULT")}
          >
            General Settings
          </button>
          <button
            className={`mx-2 hover:cursor-pointer
          ${tab === "PROFILE" && "border-b-2 border-accent-500"}
          `}
            onClick={() => changeTab("PROFILE")}
          >
            Profile
          </button>
          <button
            className={`mx-2 hover:cursor-pointer
          ${tab === "BACKUP" && "border-b-2 border-accent-500"}
          `}
            onClick={() => changeTab("BACKUP")}
          >
            Backup
          </button>
          <button
            className={`mx-2 hover:cursor-pointer
          ${tab === "USAGE" && "border-b-2 border-accent-500"}
          `}
            onClick={() => changeTab("USAGE")}
          >
            Usage
          </button>
          <DevOnly>
            <button
              data-cy="settings-application-tab"
              className={`mx-2 hover:cursor-pointer ${
                tab === "APPLICATION" && "border-b-2 border-accent-500"
              }`}
              onClick={() => changeTab("APPLICATION")}
            >
              Application
            </button>
          </DevOnly>
          <DevOnly>
            <button
              data-cy="will-events-tab"
              className={`mx-2 hover:cursor-pointer ${
                tab === "WILL_EVENTS" && "border-b-2 border-accent-500"
              }`}
              onClick={() => changeTab("WILL_EVENTS")}
            >
              Will Events
            </button>
          </DevOnly>
        </div>
        <div className="p-2">
          {tab === "DEFAULT" && <DefaultSettings />}
          {tab === "PROFILE" && <ProfileSettingsTab />}
          {tab === "BACKUP" && <BackupPanel />}
          {tab === "USAGE" && <ApplicationUsage />}
          {tab === "APPLICATION" && <ApplicationSettings />}
          {tab === "WILL_EVENTS" && <WillEvents />}
        </div>
      </div>
    </div>
  );
}

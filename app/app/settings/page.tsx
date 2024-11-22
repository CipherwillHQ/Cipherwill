"use client";

import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import ApplicationSettings from "./ApplicationSettings";
import DevOnly from "../../../components/debug/DevOnly";
import WillEvents from "./WillEvents";
import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import DefaultSettings from "./DefaultSettings";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";

export default function Settings() {
  const { logout } = useAuth();
  const [tab, setTab] = useState<"DEFAULT" | "APPLICATION" | "WILL_EVENTS">(
    "DEFAULT"
  );

  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Settings" />

      <div className="">
        <div className="flex items-center p-2">
          <button
            className={`mx-2 
          ${tab === "DEFAULT" && "border-b-2 border-accent-500"}
          `}
            onClick={() => setTab("DEFAULT")}
          >
            Settings
          </button>
          <DevOnly>
            <button
              data-cy="settings-application-tab"
              className={`mx-2 ${
                tab === "APPLICATION" && "border-b-2 border-accent-500"
              }`}
              onClick={() => setTab("APPLICATION")}
            >
              Application
            </button>
          </DevOnly>
          <DevOnly>
            <button
              data-cy="will-events-tab"
              className={`mx-2 ${
                tab === "WILL_EVENTS" && "border-b-2 border-accent-500"
              }`}
              onClick={() => setTab("WILL_EVENTS")}
            >
              Will Events
            </button>
          </DevOnly>
        </div>
        <div className="p-2">
          {tab === "DEFAULT" && <DefaultSettings />}
          {tab === "APPLICATION" && <ApplicationSettings />}
          {tab === "WILL_EVENTS" && <WillEvents />}
        </div>
      </div>
    </div>
  );
}

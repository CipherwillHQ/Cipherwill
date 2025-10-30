"use client";

import { useUserContext } from "@/contexts/UserSetupContext";
import CycleDescription from "./CycleDescription";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import { useEffect, useState } from "react";
import IncompleteProfile from "./IncompleteProfile";

export default function TimelinePage() {
  const { user, preferences } = useUserContext();
  const [interval, setInterval] = useState(365);

  useEffect(() => {
    if (preferences?.check_in_interval) {
      setInterval(preferences.check_in_interval as number);
    }
  }, [preferences]);
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Cipherwill Timeline" />
      <div className="flex flex-col gap-4 px-4">
        {user && user.birth_date && user.birth_date !== "0" ? (
          <CycleDescription
            birth_stamp={user.birth_date}
            interval={interval}
            last_accessed={user.last_accessed || null}
          />
        ) : (
          <IncompleteProfile />
        )}
      </div>
    </div>
  );
}

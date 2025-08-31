"use client";

import { useUserContext } from "@/contexts/UserSetupContext";
import CycleDescription from "./CycleDescription";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SimpleButton from "@/components/common/SimpleButton";
import { useEffect, useState } from "react";

export default function TImelinePage() {
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
      <div className="flex flex-col gap-4 p-4">
        {user && user.birth_date && user.birth_date !== "0" ? (
          <CycleDescription
            birth_stamp={user.birth_date}
            interval={interval}
            last_accessed={user.last_accessed || null}
          />
        ) : (
          <div className="flex flex-col gap-3 border border-default rounded-md p-4 bg-secondary max-w-md">
            <h2 className="font-semibold text-xl">Profile not completed</h2>
            <div>
              You need to add your birth date to view your schedule. Please add
              your birth date in your profile.
            </div>
            <SimpleButton href="/app/profile">Update profile</SimpleButton>
          </div>
        )}
      </div>
    </div>
  );
}

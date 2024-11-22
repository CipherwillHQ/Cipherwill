"use client";

import { useUserContext } from "@/contexts/UserSetupContext";
import CycleDescription from "./CycleDescription";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SimpleButton from "@/components/common/SimpleButton";

export default function TImelinePage() {
  const { user } = useUserContext();
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Cipherwill Timeline" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between p-4 border border-default rounded-md bg-secondary">
          <div>
            <h2 className="font-semibold">Interval</h2>
            <div className="text-sm lg:max-w-lg opacity-80 font-medium pt-2">
              We will regularly check to see if you've logged into your
              Cipherwill account. If we notice that you haven't, we'll start
              sending you reminders based on our schedule, encouraging you to
              log in. If you still don't take any action after the reminders,
              we'll grant access of your data to your beneficiaries.
            </div>
          </div>
          <div className="bg-primary border border-default py-2 px-4 text-sm font-semibold rounded-md w-full lg:w-fit text-center">
            Annual (Every year on Birthday)
          </div>
          {/* <CustomCipherwillInterval /> */}
        </div>

        {user && user.birth_date && user.birth_date !== "0" ? (
          <CycleDescription birth_stamp={user.birth_date} />
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

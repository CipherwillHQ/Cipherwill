"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SimpleButton from "@/components/common/SimpleButton";
import EmailNotifications from "./EmailNotifications";
import PhoneNotifications from "./PhoneNotifications";
import ComminicationsExplainer from "./ComminicationsExplainer";
import PlanRestricted from "@/components/common/PlanRestricted";
import Link from "next/link";
import { MdPhone } from "react-icons/md";

export default function NotificationsPage() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Notifications" />
      <div className="flex flex-col gap-8 px-4">
        <EmailNotifications />
        <PlanRestricted
          placeholder={
            <div className="border border-default rounded-lg bg-secondary p-4 flex flex-col items-center text-center">
              <MdPhone className="text-primary text-3xl mb-3" />
              <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
              <p className="font-medium mb-4 text-gray-700 dark:text-gray-300">
                You need to upgrade your account to get phone communications.
              </p>
              <Link href="/app/billing">
                <SimpleButton>Upgrade to Premium</SimpleButton>
              </Link>
            </div>
          }
        >
          <PhoneNotifications />
        </PlanRestricted>
        <ComminicationsExplainer />
      </div>
    </div>
  );
}

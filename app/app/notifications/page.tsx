"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import SimpleButton from "@/components/common/SimpleButton";
import { useUserContext } from "@/contexts/UserSetupContext";
import EmailNotifications from "./EmailNotifications";
import PhoneNotifications from "./PhoneNotifications";
import ComminicationsExplainer from "./ComminicationsExplainer";

export default function NotificationsPage() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Notifications" />
      <div className="flex flex-col gap-8 px-4">
        <EmailNotifications />
        <PhoneNotifications />
        <ComminicationsExplainer />
      </div>
    </div>
  );
}

"use client";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";

export default function NotificationsPage() {
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Notifications" />
      <div className="px-4">
        <div className="pb-2 text-blue-400 text-sm font-semibold">
          Necessary Notification
        </div>
        <div className="flex items-center justify-between">
          <div>Email Notifications</div>
          <div>Enabled by default</div>
        </div>

        <div className="pt-4 text-red-400 text-sm font-semibold">
          Requires Setup
        </div>
        <div className="flex items-center justify-between">
          <div>Instgram Me</div>
          <div>Coming Soon...</div>
        </div>
        <div className="flex items-center justify-between">
          <div>Twitter Me</div>
          <div>Coming Soon...</div>
        </div>
        <div className="pt-4 text-red-400 text-sm font-semibold">
          Requires Phone Number
        </div>

        <div className="flex items-center justify-between">
          <div>Whatsapp Me</div>
          <div>Coming Soon...</div>
        </div>
        <div className="flex items-center justify-between">
          <div>Telegram Me</div>
          <div>Coming Soon...</div>
        </div>
        <div className="flex items-center justify-between">
          <div>Call me</div>
          <div>Coming Soon...</div>
        </div>
        <div className="flex items-center justify-between">
          <div>Send SMS</div>
          <div>Coming Soon...</div>
        </div>
        <div className="py-2 text-blue-400 text-sm font-semibold">
          Promotional Notification
        </div>
        <div className="flex items-center justify-between">
          <div>Email Newsletter</div>
          <div>Disabled</div>
        </div>
      </div>
    </div>
  );
}

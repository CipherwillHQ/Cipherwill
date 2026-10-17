// What it does: Renders the Chat placeholder for users in its feature rollout.
// What it owns: Chat page content and redirects when chat-feature is disabled.
// What it does NOT do: Send messages or control sidebar visibility.

"use client";

import { redirect, RedirectType } from "next/navigation";
import { useFeatureFlagEnabled } from "posthog-js/react";
import MobileMenu from "@/components/app/Sidebar/MobileMenu";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";

export default function ChatPage() {
  const chatEnabled = useFeatureFlagEnabled("chat-feature");

  if (chatEnabled === undefined) return null;
  if (chatEnabled === false) return redirect("/app", RedirectType.replace);

  return (
    <div className="w-full">
      <MobileMenu />
      <DesktopAndMobilePageHeader title="Chat" />
      <div className="px-4">Chat is coming soon.</div>
    </div>
  );
}

/**
 * Topbar/index.tsx
 * What it does: Renders the dashboard's top navigation bar, including title, mobile menu trigger, compact user score pill, and user profile popup.
 * What it owns: Layout and presentation of header level items.
 * What it does NOT do: Does not manage global navigation routes or user authentication logic directly (delegated to Link and useAuth).
 */

"use client";

import MobileFloatingMenu from "../Sidebar/MobileFloatingMenu";
import UserScore from "@/app/app/score/UserScore";
import ProfilePopup from "./ProfilePopup";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <MobileFloatingMenu />
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <UserScore variant="compact" />
        <ProfilePopup />
      </div>
    </div>
  );
}

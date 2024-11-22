"use client";
import Profile from "./Profile";
import { useAuth } from "@/contexts/AuthContext";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import MobileMenu from "@/components/app/Sidebar/MobileMenu";

export default function ProfilePage() {
  const { logout } = useAuth();
  return (
    <div className="w-full">
      <MobileMenu home/>
      <DesktopAndMobilePageHeader title="Profile">
        <button
          className="border border-red-500 hover:bg-red-100 text-red-500 hover:text-red-700 py-1 px-4 text-sm rounded-md"
          onClick={logout}
        >
          Logout
        </button>
      </DesktopAndMobilePageHeader>
      <div className="p-4 flex flex-col gap-4">
        <Profile />

        <div className="max-w-3xl bg-secondary p-4 rounded-md border border-default">
          <div className="text-lg font-medium pb-2">Logout</div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="text-sm pb-4 max-w-md">
              This will log you out of your account. You will need to log in
              again to access your account. Are you sure you want to log out?
            </div>
            <button
              onClick={logout}
              className="border border-red-500 hover:bg-red-100 text-red-500 hover:text-red-700 px-8 py-1 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

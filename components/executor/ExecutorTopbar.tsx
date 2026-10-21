// Renders the executor workspace identity and profile shortcuts.
// Owns the compact header and account dropdown.
// Does not manage sidebar navigation or access permissions.

"use client";

import Link from "next/link";
import Popup from "reactjs-popup";
import { TbChevronDown, TbHomeShield, TbLogout, TbShieldCheck, TbUserCircle } from "react-icons/tb";
import { useAuth } from "@/contexts/AuthContext";
import { useUserContext } from "@/contexts/UserSetupContext";

export default function ExecutorTopbar() {
  const { user } = useUserContext();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-18 items-center justify-between gap-3 border-b border-default px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <TbShieldCheck size={21} className="shrink-0 text-sage" />
        <span className="text-sm font-semibold">Executor workspace</span>
      </div>
      <Popup
        trigger={
          <button type="button" aria-label="Open account menu" className="flex min-h-11 items-center gap-2 rounded-xl px-2 hover:bg-white dark:hover:bg-darkCard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-clay/20 text-sm font-semibold">
              {user?.first_name ? user.first_name.charAt(0).toUpperCase() : <TbUserCircle size={23} />}
            </span>
            <span className="hidden max-w-36 truncate text-sm font-medium md:block">{user?.first_name || "Your account"}</span>
            <TbChevronDown size={16} className="hidden sm:block" />
          </button>
        }
        position="bottom right"
      >
        <div className="flex w-52 flex-col gap-1 rounded-xl border border-default bg-secondary p-2 text-forest shadow-level-1 dark:text-cream">
          <Link href="/app/settings?tab=profile" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm hover:bg-neutral-100 dark:hover:bg-darkAccent focus-visible:outline-2 focus-visible:outline-primary">
            <TbUserCircle size={20} /> Profile
          </Link>
          <Link href="/app" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm hover:bg-neutral-100 dark:hover:bg-darkAccent focus-visible:outline-2 focus-visible:outline-primary">
            <TbHomeShield size={20} /> My dashboard
          </Link>
          <button type="button" data-cy="logout-btn" onClick={() => void logout()} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm hover:bg-neutral-100 dark:hover:bg-darkAccent focus-visible:outline-2 focus-visible:outline-primary">
            <TbLogout size={20} /> Log out
          </button>
        </div>
      </Popup>
    </div>
  );
}

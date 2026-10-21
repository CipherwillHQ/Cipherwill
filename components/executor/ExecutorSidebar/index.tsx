// Renders the executor's responsive sidebar and workspace shortcuts.
// Owns populated navigation, donor context, and active route styling.
// Does not fetch granted contents or change permissions.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbHomeShield, TbLoader2, TbReload, TbShieldCheck } from "react-icons/tb";
import useExecutorSegments from "@/common/executor/hooks/useExecutorSegments";
import SidebarLogo from "@/components/app/Sidebar/SidebarLogo";
import SwitchThemeButton from "@/components/app/Sidebar/SwitchThemeButton";
import SymbolicLogo from "@/components/public/logo/SymbolicLogo";
import getExecutorMenu from "./getExecutorMenu";
import DonorName from "./DonorName";

export default function ExecutorSidebar() {
  const pathname = usePathname() ?? "/executor";
  const accessId = pathname.split("/")[2];
  const { segments, loading, error, refetch } = useExecutorSegments(accessId);

  return (
    <aside aria-label="Executor navigation" className="flex h-full w-16 flex-col border-r border-default bg-white p-2 dark:bg-[#121212] sm:w-60">
      <div className="shrink-0 overflow-hidden px-1 pb-4">
        <div className="hidden sm:block"><SidebarLogo /></div>
        <Link href="/executor" aria-label="Shared wills" className="flex min-h-11 items-center justify-center rounded-xl sm:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <SymbolicLogo overrideTheme="light" size={28} className="dark:hidden" />
          <SymbolicLogo overrideTheme="dark" size={28} className="hidden dark:block" />
        </Link>
        <div className="hidden items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 sm:flex">
          <TbShieldCheck size={15} className="text-sage" /> Executor workspace
        </div>
      </div>
      {accessId && (
        <div className="mb-4 hidden rounded-xl border border-clay/20 bg-clay/10 p-3 sm:block">
          <p className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">Data of</p>
          <div className="break-words text-sm font-semibold"><DonorName key={accessId} access_id={accessId} /></div>
        </div>
      )}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto customScrollbar">
        {getExecutorMenu(pathname, segments).map((item) => {
          if ("divider" in item) {
            return <div key={item.divider} className="mx-1 border-t border-default pt-4 pb-1"><span className="hidden px-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 sm:block">{item.divider}</span></div>;
          }
          const active = item.path === pathname || (
            item.path !== "/executor" && item.path !== "/executor/" + accessId && pathname.startsWith(item.path + "/")
          );
          return (
            <Link
              key={item.path}
              href={item.path}
              title={item.title}
              aria-label={item.title}
              aria-current={active ? "page" : undefined}
              data-cy={"executor-sidebar-" + item.title}
              className={"flex min-h-11 items-center justify-center gap-3 rounded-xl border-l-4 px-2 text-sm transition-colors sm:justify-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " + (active ? "border-primary bg-primary-50 font-semibold text-primary dark:bg-darkCard dark:text-cream" : "border-transparent font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-darkCard")}
            >
              <span className="shrink-0 text-xl">{item.icon}</span>
              <span className="hidden sm:block">{item.title}</span>
            </Link>
          );
        })}
        {accessId && loading && (
          <div role="status" aria-label="Loading shared sections" className="flex min-h-11 items-center justify-center gap-3 px-3 text-sm text-neutral-500 dark:text-neutral-400 sm:justify-start">
            <TbLoader2 size={20} className="shrink-0 animate-spin" />
            <span className="hidden sm:block">Loading sections…</span>
          </div>
        )}
        {accessId && error && (
          <div role="alert">
            <button type="button" aria-label="Reload shared sections" title="Reload shared sections" onClick={() => void refetch()} className="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl px-3 text-sm text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-darkCard sm:justify-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <TbReload size={20} className="shrink-0" />
              <span className="hidden sm:block">Unable to load sections</span>
            </button>
          </div>
        )}
      </nav>
      <div className="mt-4 shrink-0 space-y-1 border-t border-default pt-3">
        <Link href="/app" title="Go to Cipherwill App" aria-label="Go to Cipherwill App" className="flex min-h-11 items-center justify-center gap-3 rounded-xl px-3 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-darkCard sm:justify-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <TbHomeShield size={20} className="shrink-0" />
          <span className="hidden sm:block">Go to Cipherwill App</span>
        </Link>
        <SwitchThemeButton compactOnMobile />
      </div>
    </aside>
  );
}

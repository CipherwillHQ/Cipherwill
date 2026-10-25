// Presents the email verification notice above the overview's setup button.
// Owns responsive notice styling and its independent verification action.
// Does not block setup or check email verification status.
import type { GuidanceOverviewProps } from "@/types/interfaces";
import { TbChevronRight, TbMail } from "react-icons/tb";

export default function EmailVerificationBanner({ onVerifyEmail }: Pick<GuidanceOverviewProps, "onVerifyEmail">) {
  return <section aria-label="Email verification needed"
    className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 gap-y-4 rounded-2xl border border-primary/15 bg-white p-4 text-left sm:grid-cols-[40px_minmax(0,1fr)_auto] sm:items-center sm:gap-x-4 sm:px-5 dark:border-primary-300/15 dark:bg-darkCard">
    <div aria-hidden="true" className="flex h-10 w-10 items-center justify-center self-start rounded-xl bg-primary/8 text-primary sm:self-center dark:bg-primary-300/10 dark:text-primary-200">
      <TbMail size={22} />
    </div>
    <div className="min-w-0">
      <h2 className="text-sm font-semibold leading-snug text-forest sm:text-base dark:text-cream">Email verification needed</h2>
      <p className="mt-1 text-sm leading-relaxed text-forest/70 dark:text-cream/70">Confirm your email address to secure your account.</p>
    </div>
    <button type="button" onClick={onVerifyEmail}
      className="col-span-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:col-span-1 sm:whitespace-nowrap dark:border-primary-300/25 dark:bg-primary-300/10 dark:text-primary-200 dark:hover:bg-primary-300/15 dark:focus-visible:outline-primary-300">
      <span className="min-w-0">Verify your email</span><TbChevronRight size={16} aria-hidden="true" className="shrink-0" />
    </button>
  </section>;
}

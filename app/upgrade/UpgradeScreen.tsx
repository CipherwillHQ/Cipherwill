// Displays a focused, mobile-friendly Premium purchase screen.
// Owns plan information and public checkout loading, error, and success states.
// Does not render dashboard navigation or fetch private account details.
"use client";

import Link from "next/link";
import { TbCheck, TbCircleCheck, TbCrown, TbLock } from "react-icons/tb";
import SymbolicLogo from "@/components/public/logo/SymbolicLogo";
import SimpleButton from "@/components/common/SimpleButton";
import type { UpgradeScreenProps } from "@/types/interfaces";
import useUpgradeCheckout from "./useUpgradeCheckout";

const features = [
  "Unlimited beneficiaries and data",
  "Access to all asset categories",
  "1 GB of encrypted file storage",
  "Assign beneficiaries to individual assets",
  "Notifications via email, calls, SMS, and WhatsApp",
];

export default function UpgradeScreen({ email, userId }: UpgradeScreenProps) {
  const checkout = useUpgradeCheckout({ email, userId });

  return (
    <main className="flex min-h-dvh items-center justify-center bg-cream px-4 py-8 text-forest sm:py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <SymbolicLogo overrideTheme="light" size={36} />
          <span className="text-xl font-semibold">Cipherwill</span>
        </div>

        {checkout.completed ? (
          <section className="rounded-2xl border border-forest/10 bg-parchment p-6 text-center sm:p-8" aria-live="polite">
            <TbCircleCheck className="mx-auto mb-4 text-sage" size={48} aria-hidden="true" />
            <h1 className="font-playfair text-3xl">Thank you for upgrading</h1>
            <p className="mt-4 text-neutral-600">
              Your payment was received. Premium will appear in your account once processing finishes.
            </p>
            <p className="mt-4 font-medium">You can close this page and return to the Cipherwill app.</p>
          </section>
        ) : (
          <section className="rounded-2xl border border-forest/10 bg-parchment p-6 sm:p-8">
            <TbCrown className="mb-4 text-primary" size={32} aria-hidden="true" />
            <h1 className="font-playfair text-3xl sm:text-4xl">Upgrade to Premium</h1>
            <p className="mt-3 text-neutral-600">More protection for everything you want to pass on.</p>

            {checkout.hasValidLink && (
              <div className="mt-5 rounded-xl border border-forest/10 bg-cream px-4 py-3">
                <p className="text-xs text-neutral-500">Upgrading your Cipherwill account</p>
                <p className="mt-1 break-all text-sm font-medium">{email}</p>
              </div>
            )}

            <div className="my-6 flex items-baseline gap-2">
              <span className="text-5xl font-semibold">$40</span>
              <span className="text-neutral-500">USD / year</span>
            </div>
            <ul className="mb-6 space-y-3 text-sm">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <TbCheck className="mt-0.5 shrink-0 text-primary" size={18} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {!checkout.hasValidLink && (
              <p role="alert" className="mb-4 text-sm text-error">
                This upgrade link is incomplete or invalid. Please reopen it from the Cipherwill app.
              </p>
            )}
            {checkout.hasValidLink && checkout.error && (
              <p role="alert" className="mb-4 text-sm text-error">{checkout.error}</p>
            )}
            <SimpleButton
              onClick={checkout.openCheckout}
              disabled={!checkout.canCheckout}
              className="min-h-12 w-full rounded-xl px-6 py-3 font-semibold transition duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {checkout.loading ? "Preparing checkout…" : checkout.checkoutOpen ? "Checkout open…" : "Upgrade to Premium →"}
            </SimpleButton>
            <p className="mt-3 text-center text-xs text-neutral-500">Renews annually. Cancel anytime. Taxes shown at checkout.</p>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500">
              <TbLock size={16} aria-hidden="true" /> Secure checkout by Paddle
            </div>
          </section>
        )}

        <p className="mt-6 text-center text-xs text-neutral-500">
          <Link href="/i/terms-of-service" className="rounded-sm underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Terms of Service</Link>
          {" · "}
          <Link href="/i/privacy-policy" className="rounded-sm underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}

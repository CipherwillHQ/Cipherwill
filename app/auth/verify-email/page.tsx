"use client";
import { useEffect, useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { BiCheckCircle } from "react-icons/bi";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { RedirectType, redirect } from "next/navigation";
import { useLazyQuery } from "@apollo/client/react";
import ME from "../../../graphql/ops/auth/queries/ME";
import { sleep } from "../../../common/time/sleep";
import Link from "next/link";
import type { MeQuery } from "@/types/interfaces/metamodel";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import SimpleButton from "@/components/common/SimpleButton";

export default function VerifyEmail() {
  const { isLoading, user, getIdToken, sendEmailVerification } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [fetchUser, { data: userData }] = useLazyQuery<MeQuery>(ME, {
    fetchPolicy: "network-only",
  });

  // Handle user data when loaded
  useEffect(() => {
    if (userData?.me?.email_verified) {
      window.location.href = "/app";
    }
  }, [userData]);

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  if (isLoading && !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-black/95">
        <div className="animate-pulse text-neutral-600 font-medium">
          Loading verification details...
        </div>
      </main>
    );
  }
  if (!isLoading && !user) return redirect("/auth", RedirectType.replace);

  return (
    <main className="min-h-screen bg-dark-50 dark:bg-black/95 text-black dark:text-white">
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 min-h-screen flex items-center">
        <section className="w-full rounded-2xl border border-default bg-secondary p-4 sm:p-6 md:p-7">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Link
                href="/app"
                className="inline-flex items-center text-sm text-neutral-600 dark:text-neutral-300 hover:underline"
              >
                <IoArrowBackCircleOutline size={20} className="mr-1" />
                Back to app
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl font-semibold">Verify your email</h1>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                Confirm your email to unlock all dashboard actions and keep your account secure.
              </p>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-default bg-white/70 dark:bg-black/25 px-3 py-1.5 text-sm">
                <IoMailOutline size={16} />
                <span>{user?.email}</span>
              </div>
            </div>

            {!emailSent && (
              <div className="rounded-xl border border-default bg-white/50 dark:bg-black/20 p-3">
                <div className="text-sm font-medium mb-1">What happens next</div>
                <ul className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-1">
                  <li>1. We send a secure verification link to your inbox.</li>
                  <li>2. Open the link in the same browser/session.</li>
                  <li>3. Return here and confirm to enter the app.</li>
                </ul>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-300/60 bg-red-100/70 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {!emailSent && (
              <SimpleButton
                className="w-full sm:w-auto rounded-full px-5 py-2.5 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={sendingEmail}
                onClick={async () => {
                  setError(null);
                  setSendingEmail(true);
                  const res = await sendEmailVerification();
                  if (res && res.error) {
                    setError(res.error);
                  } else {
                    toast.success("Verification email sent");
                    setEmailSent(true);
                  }
                  setSendingEmail(false);
                }}
              >
                <IoMailOutline size={18} />
                <span className="pl-2">
                  {sendingEmail ? "Sending..." : "Send verification email"}
                </span>
              </SimpleButton>
            )}

            {emailSent && (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-default bg-white/60 dark:bg-black/20 p-4">
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <BiCheckCircle className="text-primary text-lg" />
                    Check your inbox
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Verification mail sent. Open the link from your inbox, then return here to continue.
                  </p>
                </div>

                <SimpleButton
                  variant="secondary"
                  className="w-full sm:w-auto rounded-full px-5 py-2.5 bg-white dark:bg-black/30 text-neutral-900 dark:text-white border border-default hover:bg-dark-100 dark:hover:bg-black/50 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={validatingEmail}
                  onClick={async () => {
                    if (validatingEmail) return;
                    setValidatingEmail(true);
                    toast.success("Checking verification status...");
                    await getIdToken(true);
                    await sleep(1000);
                    await fetchUser();
                    setValidatingEmail(false);
                  }}
                >
                  {validatingEmail ? "Checking status..." : "I have verified my email"}
                </SimpleButton>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

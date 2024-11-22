"use client";
import { useEffect, useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { RedirectType, redirect } from "next/navigation";
import { useLazyQuery } from "@apollo/client";
import ME from "../../../graphql/ops/auth/queries/ME";
import { sleep } from "../../../common/time/sleep";
import Link from "next/link";

export default function VerifyEmail() {
  const { isLoading, user, getIdToken, sendEmailVerification } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [fetchUser] = useLazyQuery(ME, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      if (data.me.email_verified) {
        window.location.href = "/app";
      }
    },
  });
  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  if (isLoading && !user) return <div>Loading...</div>;
  if (!isLoading && !user) return redirect("/auth", RedirectType.replace);

  return (
    <main className="flex flex-col gap-4 items-center justify-center h-screen w-full p-2 max-w-xs mx-auto">
      <h1 className="font-bold text-2xl">Verify Email</h1>
      <div className="text-center">
        <span className="font-semibold">Email:</span> {user.email}
      </div>
      {error !== null && (
        <div className="text-red-500 text-sm">Error: {error}</div>
      )}
      {emailSent === false && (
        <button
          className="w-full border flex items-center justify-center p-2 rounded-full hover:bg-slate-100"
          onClick={async () => {
            setError(null);
            const res = await sendEmailVerification();
            if (res && res.error) {
              setError(res.error);
            } else {
              toast.success("Email sent");
              setEmailSent(true);
            }
          }}
        >
          <IoMailOutline size={22} />
          <span className="pl-2">Send Email Verification</span>
        </button>
      )}

      {emailSent === true && (
        <div className="flex flex-col gap-4">
          <div className="text-center">
            We&apos;ve sent you an email with a link to verify your email.
            Please click the link to verify your email.
          </div>
          <button
            className="w-full border flex items-center justify-center p-2 rounded-full hover:bg-slate-100"
            onClick={async () => {
              if (validatingEmail) return;
              setValidatingEmail(true);
              toast.success("Validating email...");
              await getIdToken(true); // force refresh token
              await sleep(1000);
              await fetchUser();
              setValidatingEmail(false);
            }}
          >
            I&apos;ve verified my email
          </button>
        </div>
      )}
      
      <Link
        className="w-full flex items-center justify-center p-2 hover:underline"
        href={"/app"}
      >
        Go back to app
      </Link>
    </main>
  );
}

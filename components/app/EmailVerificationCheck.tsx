"use client";

import { useUserContext } from "@/contexts/UserSetupContext";
import Link from "next/link";

export default function EmailVerificationCheck() {
  const { user } = useUserContext();
  const email_verified = user?.email_verified;
  return (
    email_verified === false && (
      <div className="w-full border border-default p-4 rounded-md flex items-center justify-between bg-secondary">
        Your email not verified
        <Link
          className="bg-orange-200 hover:bg-orange-300 text-sm px-3 py-1 rounded-full mx-2 text-black"
          href={"/auth/verify-email"}
        >
          Verify Now
        </Link>
      </div>
    )
  );
}

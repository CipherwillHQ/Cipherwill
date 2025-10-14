"use client";

import { useUserContext } from "@/contexts/UserSetupContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";

export default function EmailVerificationCheck() {
  const { user } = useUserContext();
  const email_verified = user?.email_verified;

  if (email_verified) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full border border-default bg-secondary p-4 rounded-lg flex items-center justify-between mb-2"
    >
      <div className="flex items-center gap-3">
        <MdEmail className="text-accent-500 text-xl min-w-[24px]" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Please verify your email to access all features and secure your account.
        </p>
      </div>
      <Link
        className="bg-accent-500 hover:bg-accent-600 text-white text-sm px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 text-center"
        href={"/auth/verify-email"}
      >
        Verify Now
      </Link>
    </motion.div>
  );
}

// What it does: Displays the password-reset form and its backend email outcome.
// What it owns: Reset input, loading state, and accepted or skipped feedback.
// What it does NOT do: Decide recipient eligibility or send email directly.

import { useState } from "react";
import toast from "react-hot-toast";
import type { PasswordResetFormProps } from "@/types/interfaces";

export default function PasswordResetForm({ email: initialEmail, onClose, sendPasswordResetEmail }: PasswordResetFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isSending, setIsSending] = useState(false);
  return (
    <div className="max-w-md bg-white px-4 pt-2 pb-6 rounded-sm flex flex-col gap-2">
      <h2 className="text-xl py-2 font-bold text-gray-900 mb-2 w-[50vw]">Reset password</h2>
      <label htmlFor="forgot-email" className="font-semibold text-black">Email</label>
      <input id="forgot-email" value={email} onChange={(event) => setEmail(event.target.value)}
        disabled={isSending} type="email" className="p-2 border rounded-sm" placeholder="Enter your email" />
      <div className="text-gray-600 my-4 font-medium">Verified email addresses can receive a link to reset their password.</div>
      <button type="button" disabled={isSending}
        className="bg-primary hover:bg-primary-900 hover:cursor-pointer text-white p-2 rounded-sm font-semibold"
        onClick={async () => {
          if (!email.trim().includes("@")) return void toast.error("Please enter a valid email");
          setIsSending(true);
          try {
            const result = await sendPasswordResetEmail(email);
            if (result.sent) { toast.success("Password reset email sent"); onClose(); }
            else toast.error(result.reason || "Password reset email was not sent");
          } catch {
            toast.error("Password reset request failed. Please try again");
          } finally { setIsSending(false); }
        }}
      >{isSending ? "Sending..." : "Send password reset email"}</button>
    </div>
  );
}

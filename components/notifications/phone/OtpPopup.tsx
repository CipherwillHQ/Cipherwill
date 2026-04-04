import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import BasicPopup from "@/components/BasicPopup";
import { PopupHeader, SpinnerIcon } from "@/components/notifications/phone/PopupHeader";
import VERIFY_USER_PHONE_NUMBER from "@/graphql/ops/auth/mutations/VERIFY_USER_PHONE_NUMBER";
import { VerifyUserPhoneNumberVariables } from "@/types/graphql";

type OtpPopupProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  phoneIdToVerify: string | null;
  setPhoneIdToVerify: (phoneId: string | null) => void;
  onRefetch: () => void;
};

function sanitizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default function OtpPopup({
  open,
  setOpen,
  phoneIdToVerify,
  setPhoneIdToVerify,
  onRefetch,
}: OtpPopupProps) {
  const [otp, setOtp] = useState("");
  const [verifyPhoneNumber, { loading: verifying }] = useMutation<
    boolean,
    VerifyUserPhoneNumberVariables
  >(VERIFY_USER_PHONE_NUMBER);

  const handleVerifyOtp = async () => {
    if (!phoneIdToVerify || !otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      await verifyPhoneNumber({
        variables: {
          id: phoneIdToVerify,
          otp: otp.trim(),
        },
      });
      setOpen(false);
      setOtp("");
      setPhoneIdToVerify(null);
      onRefetch();
      toast.success("Phone number verified successfully");
    } catch (err) {
      console.error("Error verifying phone number:", err);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <BasicPopup open={open} setOpen={setOpen}>
      <div className="w-full max-w-md">
        <PopupHeader
          title="Verify Phone Number"
          iconPath="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          onClose={() => setOpen(false)}
        />

        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            We've sent a verification code to your phone number. Please enter
            the 6-digit code below.
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = sanitizeDigits(e.target.value);
                if (value.length <= 6) {
                  setOtp(value);
                }
              }}
              placeholder="123456"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              maxLength={6}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter the 6-digit code sent to your phone
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyOtp}
              disabled={verifying || otp.length !== 6}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              {verifying && <SpinnerIcon />}
              {verifying ? "Verifying..." : "Verify Phone Number"}
            </button>
          </div>
        </div>
      </div>
    </BasicPopup>
  );
}

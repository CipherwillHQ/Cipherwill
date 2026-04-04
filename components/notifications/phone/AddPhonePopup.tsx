import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import BasicPopup from "@/components/BasicPopup";
import { PopupHeader, SpinnerIcon } from "@/components/notifications/phone/PopupHeader";
import ADD_USER_PHONE_NUMBER from "@/graphql/ops/auth/mutations/ADD_USER_PHONE_NUMBER";
import SEND_USER_PHONE_VERIFICATION_CODE from "@/graphql/ops/auth/mutations/SEND_USER_PHONE_VERIFICATION_CODE";
import {
  AddUserPhoneNumberVariables,
  GetUserPhoneNumbersData,
  SendUserPhoneVerificationCodeVariables,
} from "@/types/graphql";

type AddPhonePopupProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRefetch: () => Promise<{ data?: GetUserPhoneNumbersData }>;
  onPhoneReadyForVerification: (phoneId: string) => void;
};

function sanitizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

export default function AddPhonePopup({
  open,
  setOpen,
  onRefetch,
  onPhoneReadyForVerification,
}: AddPhonePopupProps) {
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);

  const [addPhoneNumber, { loading: adding }] = useMutation<
    boolean,
    AddUserPhoneNumberVariables
  >(ADD_USER_PHONE_NUMBER);

  const [sendVerificationCode] = useMutation<
    boolean,
    SendUserPhoneVerificationCodeVariables
  >(SEND_USER_PHONE_VERIFICATION_CODE);

  const handleAddPhoneNumber = async () => {
    if (!phoneCode.trim()) {
      toast.error("Please enter a country code");
      return;
    }

    if (!phoneNum.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    if (phoneNum.length < 4) {
      toast.error("Phone number must be at least 4 digits long");
      return;
    }

    if (!consentAcknowledged) {
      toast.error("Please confirm you agree to receive messages");
      return;
    }

    if (!policiesAccepted) {
      toast.error("Please accept the Privacy Policy and Terms of Service");
      return;
    }

    const trimmedPhoneCode = phoneCode.trim();
    const trimmedPhoneNum = phoneNum.trim();

    try {
      await addPhoneNumber({
        variables: {
          phone_code: trimmedPhoneCode,
          phone_num: trimmedPhoneNum,
        },
      });
      setPhoneCode("");
      setPhoneNum("");
      setConsentAcknowledged(false);
      setPoliciesAccepted(false);
      setOpen(false);
      const refetchResult = await onRefetch();

      const newPhone = refetchResult.data?.getUserPhoneNumbers.find(
        (phone) =>
          phone.phone_code === trimmedPhoneCode &&
          phone.phone_num === trimmedPhoneNum
      );

      if (newPhone) {
        await sendVerificationCode({
          variables: {
            id: newPhone.id,
          },
        });
        onPhoneReadyForVerification(newPhone.id);
        toast.success("OTP sent to your phone number");
      } else {
        toast.success("Phone number added successfully");
      }
    } catch (err) {
      console.error("Error adding phone number:", err);
      toast.error("Failed to add phone number. Please try again.");
    }
  };

  return (
    <BasicPopup open={open} setOpen={setOpen}>
      <div className="w-full max-w-md">
        <PopupHeader
          title="Add Phone Number"
          iconPath="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          onClose={() => setOpen(false)}
        />

        <div className="space-y-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Add a phone number to receive important notifications and security
            alerts.
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <div className="relative">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
                <div className="flex items-center pl-3 pr-2 py-2 border-r border-gray-300 dark:border-gray-600">
                  <span className="text-gray-500 dark:text-gray-400 text-sm mr-1">
                    +
                  </span>
                  <input
                    type="text"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(sanitizeDigits(e.target.value))}
                    placeholder="1"
                    className="w-12 bg-transparent focus:outline-none text-sm"
                    maxLength={4}
                  />
                </div>
                <input
                  type="text"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(sanitizeDigits(e.target.value))}
                  placeholder="123 456 7890"
                  className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
                />
              </div>

              <label className="my-3 flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={consentAcknowledged}
                  onChange={(e) => setConsentAcknowledged(e.target.checked)}
                />
                <span className="text-gray-600 dark:text-gray-400">
                  By providing your mobile number and opting in, you agree to
                  receive transactional and account-related SMS messages from
                  Cipherwill, including one-time passwords (OTPs), security
                  alerts, timeline check-in reminders, and important account
                  notifications. Message frequency varies based on account
                  activity. Message and data rates may apply. You can opt out
                  at any time by replying STOP.
                </span>
              </label>

              <label className="my-3 flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={policiesAccepted}
                  onChange={(e) => setPoliciesAccepted(e.target.checked)}
                />
                <span className="text-gray-600 dark:text-gray-400">
                  I have read and agree to the{" "}
                  <Link
                    href="/i/privacy-policy"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    Privacy Policy
                  </Link>
                  {" "}and{" "}
                  <Link
                    href="/i/terms-of-service"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    Terms of Service
                  </Link>
                  .
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPhoneNumber}
              disabled={
                adding ||
                !phoneCode.trim() ||
                !phoneNum.trim() ||
                phoneNum.length < 4 ||
                !consentAcknowledged ||
                !policiesAccepted
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 hover:cursor-pointer"
            >
              {adding && <SpinnerIcon />}
              {adding ? "Adding..." : "Add Phone Number"}
            </button>
          </div>
        </div>
      </div>
    </BasicPopup>
  );
}

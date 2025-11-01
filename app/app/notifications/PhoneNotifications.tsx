"use client";
import { useState } from "react";
import SimpleButton from "@/components/common/SimpleButton";
import BasicPopup from "@/components/BasicPopup";
import { useQuery, useMutation } from "@apollo/client/react";
import GET_USER_PHONE_NUMBERS from "@/graphql/ops/auth/queries/GET_USER_PHONE_NUMBERS";
import ADD_USER_PHONE_NUMBER from "@/graphql/ops/auth/mutations/ADD_USER_PHONE_NUMBER";
import REMOVE_USER_PHONE_NUMBER from "@/graphql/ops/auth/mutations/REMOVE_USER_PHONE_NUMBER";
import SEND_USER_PHONE_VERIFICATION_CODE from "@/graphql/ops/auth/mutations/SEND_USER_PHONE_VERIFICATION_CODE";
import VERIFY_USER_PHONE_NUMBER from "@/graphql/ops/auth/mutations/VERIFY_USER_PHONE_NUMBER";
import {
  GetUserPhoneNumbersData,
  AddUserPhoneNumberVariables,
  RemoveUserPhoneNumberVariables,
  SendUserPhoneVerificationCodeVariables,
  VerifyUserPhoneNumberVariables,
} from "@/types/graphql";
import toast from "react-hot-toast";

export default function PhoneNotifications() {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [phoneToRemove, setPhoneToRemove] = useState<{
    id: string;
    display: string;
  } | null>(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [phoneIdToVerify, setPhoneIdToVerify] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery<GetUserPhoneNumbersData>(
    GET_USER_PHONE_NUMBERS
  );
  const [addPhoneNumber, { loading: adding }] = useMutation<
    boolean,
    AddUserPhoneNumberVariables
  >(ADD_USER_PHONE_NUMBER);
  const [removePhoneNumber, { loading: removing }] = useMutation<
    boolean,
    RemoveUserPhoneNumberVariables
  >(REMOVE_USER_PHONE_NUMBER);
  const [sendVerificationCode, { loading: sendingOtp }] = useMutation<
    boolean,
    SendUserPhoneVerificationCodeVariables
  >(SEND_USER_PHONE_VERIFICATION_CODE);
  const [verifyPhoneNumber, { loading: verifying }] = useMutation<
    boolean,
    VerifyUserPhoneNumberVariables
  >(VERIFY_USER_PHONE_NUMBER);

  const userPhoneNumbers = data?.getUserPhoneNumbers || [];

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

    try {
      await addPhoneNumber({
        variables: {
          phone_code: phoneCode.trim(),
          phone_num: phoneNum.trim(),
        },
      });
      setPhoneCode("");
      setPhoneNum("");
      setShowAddPopup(false);
      const refetchResult = await refetch(); // Refresh the phone numbers list

      // Find the newly added phone number
      const newPhone = refetchResult.data?.getUserPhoneNumbers.find(
        (phone) =>
          phone.phone_code === phoneCode.trim() &&
          phone.phone_num === phoneNum.trim()
      );

      if (newPhone) {
        // Send verification code
        await sendVerificationCode({
          variables: {
            id: newPhone.id,
          },
        });
        setPhoneIdToVerify(newPhone.id);
        setShowOtpPopup(true);
        toast.success("OTP sent to your phone number");
      } else {
        toast.success("Phone number added successfully");
      }
    } catch (err) {
      console.error("Error adding phone number:", err);
      toast.error("Failed to add phone number. Please try again.");
    }
  };

  const handleRemovePhoneNumber = (phoneNumber: any) => {
    setPhoneToRemove({
      id: phoneNumber.id,
      display: `+${phoneNumber.phone_code} ${phoneNumber.phone_num}`,
    });
    setShowRemovePopup(true);
  };

  const confirmRemovePhoneNumber = async () => {
    if (!phoneToRemove) return;

    try {
      await removePhoneNumber({
        variables: {
          id: phoneToRemove.id,
        },
      });
      setShowRemovePopup(false);
      setPhoneToRemove(null);
      refetch(); // Refresh the phone numbers list
    } catch (err) {
      console.error("Error removing phone number:", err);
    }
  };

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
      setShowOtpPopup(false);
      setOtp("");
      setPhoneIdToVerify(null);
      refetch(); // Refresh the phone numbers list
      toast.success("Phone number verified successfully");
    } catch (err) {
      console.error("Error verifying phone number:", err);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleSendVerificationCode = async (phoneId: string) => {
    try {
      await sendVerificationCode({
        variables: {
          id: phoneId,
        },
      });
      setPhoneIdToVerify(phoneId);
      setShowOtpPopup(true);
      toast.success("OTP sent to your phone number");
    } catch (err) {
      console.error("Error sending verification code:", err);
      toast.error("Failed to send verification code. Please try again.");
    }
  };

  if (loading) return <div>Loading phone numbers...</div>;
  if (error) return <div>Error loading phone numbers: {error.message}</div>;
  return (
    <div>
      <div className="flex justify-between pb-4">
        <h2>Phone Numbers</h2>
        <SimpleButton onClick={() => setShowAddPopup(true)}>
          Add phone number
        </SimpleButton>
      </div>
      {userPhoneNumbers.length === 0 && (
        <p className="text-gray-500">No phone numbers added yet.</p>
      )}
      <div className="flex flex-col gap-4">
        {userPhoneNumbers.map((phoneNumber) => (
          <div
            key={phoneNumber.id}
            className="border border-default bg-secondary rounded-md p-4 flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                Phone Number: +{phoneNumber.phone_code} {phoneNumber.phone_num}
              </h3>
              <SimpleButton
                variant="danger"
                onClick={() => handleRemovePhoneNumber(phoneNumber)}
                className="text-sm px-3 py-1"
              >
                Remove
              </SimpleButton>
            </div>

            {!phoneNumber.verified ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-yellow-800 dark:text-yellow-200 font-medium">
                      Phone Number Not Verified
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                      Please verify this phone number to enable notifications.
                    </p>
                  </div>
                  <SimpleButton
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    onClick={() => handleSendVerificationCode(phoneNumber.id)}
                  >
                    Verify Number
                  </SimpleButton>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold">Phone Calls</h4>
                    <p>
                      Receive important phone calls such as cipherwill
                      reminders, security alerts, and account activity
                      notifications.
                    </p>
                  </div>
                  <div className="mt-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold">Text Messages (SMS)</h4>
                    <p>
                      Receive important text messages such as cipherwill
                      reminders, security alerts, and account activity
                      notifications.
                    </p>
                  </div>
                  <div className="mt-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold">Whatsapp Messages</h4>
                    <p>
                      Receive important Whatsapp messages such as cipherwill
                      reminders, security alerts, and account activity
                      notifications.
                    </p>
                  </div>
                  <div className="mt-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <BasicPopup open={showAddPopup} setOpen={setShowAddPopup}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Phone Number
              </h2>
            </div>
            <button
              onClick={() => setShowAddPopup(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
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
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                        setPhoneCode(value);
                      }}
                      placeholder="1"
                      className="w-12 bg-transparent focus:outline-none text-sm"
                      maxLength={4}
                    />
                  </div>
                  <input
                    type="text"
                    value={phoneNum}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                      setPhoneNum(value);
                    }}
                    placeholder="123 456 7890"
                    className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-sm"
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter your country code and phone number (minimum 4 digits)
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowAddPopup(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPhoneNumber}
                disabled={
                  adding ||
                  !phoneCode.trim() ||
                  !phoneNum.trim() ||
                  phoneNum.length < 4
                }
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                {adding && (
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {adding ? "Adding..." : "Add Phone Number"}
              </button>
            </div>
          </div>
        </div>
      </BasicPopup>

      <BasicPopup open={showRemovePopup} setOpen={setShowRemovePopup}>
        <h2 className="text-xl font-semibold mb-4">Remove Phone Number</h2>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to remove the phone number{" "}
            <strong>{phoneToRemove?.display}</strong>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone. You will no longer receive
            notifications on this number.
          </p>
          <div className="flex gap-2 justify-end">
            <SimpleButton onClick={() => setShowRemovePopup(false)}>
              Cancel
            </SimpleButton>
            <SimpleButton
              variant="danger"
              onClick={confirmRemovePhoneNumber}
              disabled={removing}
            >
              {removing ? "Removing..." : "Remove Phone Number"}
            </SimpleButton>
          </div>
        </div>
      </BasicPopup>

      <BasicPopup open={showOtpPopup} setOpen={setShowOtpPopup}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Verify Phone Number
              </h2>
            </div>
            <button
              onClick={() => setShowOtpPopup(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
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
                  const value = e.target.value.replace(/\D/g, ""); // Only allow digits
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

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowOtpPopup(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={verifying || otp.length !== 6}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                {verifying && (
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {verifying ? "Verifying..." : "Verify Phone Number"}
              </button>
            </div>
          </div>
        </div>
      </BasicPopup>
    </div>
  );
}

import { useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import ConfirmationButton from "@/components/common/ConfirmationButton";
import SimpleButton from "@/components/common/SimpleButton";
import PreferenceRow, {
  ALLOWED_PREFERENCE_KEYS,
  NotificationPreferenceKey,
  PREFERENCE_SECTIONS,
} from "@/components/notifications/phone/PreferenceRow";
import SEND_USER_PHONE_VERIFICATION_CODE from "@/graphql/ops/auth/mutations/SEND_USER_PHONE_VERIFICATION_CODE";
import UPDATE_MOBILE_PREFERENCES from "@/graphql/ops/auth/mutations/UPDATE_MOBILE_PREFERENCES";
import {
  SendUserPhoneVerificationCodeVariables,
  UpdateMobilePreferencesData,
  UpdateMobilePreferencesVariables,
} from "@/types/graphql";
import { UserPhoneNumber } from "@/components/notifications/phone/types";

type PhoneNumbersListProps = {
  userPhoneNumbers: UserPhoneNumber[];
  onRemovePhoneNumber: (phoneNumber: UserPhoneNumber) => void;
  onOtpRequested: (phoneId: string) => void;
};

export default function PhoneNumbersList({
  userPhoneNumbers,
  onRemovePhoneNumber,
  onOtpRequested,
}: PhoneNumbersListProps) {
  const [sendVerificationCode] = useMutation<
    boolean,
    SendUserPhoneVerificationCodeVariables
  >(SEND_USER_PHONE_VERIFICATION_CODE);
  const [updateMobilePreferences, { loading: updatingPreferences }] =
    useMutation<UpdateMobilePreferencesData, UpdateMobilePreferencesVariables>(
      UPDATE_MOBILE_PREFERENCES
    );

  const handleSendVerificationCode = async (phoneId: string) => {
    try {
      await sendVerificationCode({
        variables: {
          id: phoneId,
        },
      });
      onOtpRequested(phoneId);
      toast.success("OTP sent to your phone number");
    } catch (err) {
      console.error("Error sending verification code:", err);
      toast.error("Failed to send verification code. Please try again.");
    }
  };

  const handleUpdatePreference = async (
    phoneId: string,
    key: NotificationPreferenceKey,
    value: boolean
  ) => {
    if (!ALLOWED_PREFERENCE_KEYS.includes(key)) {
      toast.error("Invalid preference key");
      return;
    }

    try {
      await updateMobilePreferences({
        variables: {
          id: phoneId,
          key,
          value,
        },
      });
      toast.success("Notification preference updated successfully");
    } catch (err) {
      console.error("Error updating preference:", err);
      toast.error(
        "Failed to update notification preference. Please try again."
      );
    }
  };

  if (userPhoneNumbers.length === 0) {
    return <p className="text-gray-500">No phone numbers added yet.</p>;
  }

  return (
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
            <ConfirmationButton
              onConfirm={() => onRemovePhoneNumber(phoneNumber)}
              className="text-sm px-3 py-1 text-red-700 dark:text-red-400"
            >
              Remove
            </ConfirmationButton>
          </div>

          {phoneNumber.verified && (
            <div className="hidden md:flex justify-between gap-2 font-semibold text-sm">
              <div className="w-full max-w-2/3 text-left opacity-0">feature</div>
              <div className="w-full max-w-1/6 text-center">Mandatory</div>
              <div className="w-full max-w-1/6 text-center">Promotional</div>
            </div>
          )}

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
              {PREFERENCE_SECTIONS.map((section) => (
                <PreferenceRow
                  key={`${phoneNumber.id}-${section.title}`}
                  phoneNumber={phoneNumber}
                  section={section}
                  disabled={updatingPreferences}
                  onToggle={handleUpdatePreference}
                />
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

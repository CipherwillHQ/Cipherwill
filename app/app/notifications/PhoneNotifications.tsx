"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import SimpleButton from "@/components/common/SimpleButton";
import AddPhonePopup from "@/components/notifications/phone/AddPhonePopup";
import OtpPopup from "@/components/notifications/phone/OtpPopup";
import PhoneNumbersList from "@/components/notifications/phone/PhoneNumbersList";
import RemovePhonePopup from "@/components/notifications/phone/RemovePhonePopup";
import { PhoneToRemove, UserPhoneNumber } from "@/components/notifications/phone/types";
import GET_USER_PHONE_NUMBERS from "@/graphql/ops/auth/queries/GET_USER_PHONE_NUMBERS";
import { GetUserPhoneNumbersData } from "@/types/graphql";

export default function PhoneNotifications() {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [phoneToRemove, setPhoneToRemove] = useState<PhoneToRemove | null>(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [phoneIdToVerify, setPhoneIdToVerify] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery<GetUserPhoneNumbersData>(
    GET_USER_PHONE_NUMBERS
  );

  const userPhoneNumbers = data?.getUserPhoneNumbers || [];

  if (loading) return <div>Loading phone numbers...</div>;
  if (error) return <div>Error loading phone numbers: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-between pb-4">
        <h2 className="font-medium">Phone Numbers</h2>
        <SimpleButton onClick={() => setShowAddPopup(true)}>
          Add phone number
        </SimpleButton>
      </div>

      <PhoneNumbersList
        userPhoneNumbers={userPhoneNumbers}
        onRemovePhoneNumber={(phoneNumber: UserPhoneNumber) => {
          setPhoneToRemove({
            id: phoneNumber.id,
            display: `+${phoneNumber.phone_code} ${phoneNumber.phone_num}`,
          });
          setShowRemovePopup(true);
        }}
        onOtpRequested={(phoneId: string) => {
          setPhoneIdToVerify(phoneId);
          setShowOtpPopup(true);
        }}
      />

      <AddPhonePopup
        open={showAddPopup}
        setOpen={setShowAddPopup}
        onRefetch={refetch}
        onPhoneReadyForVerification={(phoneId: string) => {
          setPhoneIdToVerify(phoneId);
          setShowOtpPopup(true);
        }}
      />

      <RemovePhonePopup
        open={showRemovePopup}
        setOpen={setShowRemovePopup}
        phoneToRemove={phoneToRemove}
        onRefetch={refetch}
        onClearSelection={() => setPhoneToRemove(null)}
      />

      <OtpPopup
        open={showOtpPopup}
        setOpen={setShowOtpPopup}
        phoneIdToVerify={phoneIdToVerify}
        setPhoneIdToVerify={setPhoneIdToVerify}
        onRefetch={refetch}
      />
    </div>
  );
}


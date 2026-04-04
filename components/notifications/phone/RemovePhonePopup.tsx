import { useMutation } from "@apollo/client/react";
import BasicPopup from "@/components/BasicPopup";
import SimpleButton from "@/components/common/SimpleButton";
import REMOVE_USER_PHONE_NUMBER from "@/graphql/ops/auth/mutations/REMOVE_USER_PHONE_NUMBER";
import { RemoveUserPhoneNumberVariables } from "@/types/graphql";
import { PhoneToRemove } from "@/components/notifications/phone/types";

type RemovePhonePopupProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  phoneToRemove: PhoneToRemove | null;
  onRefetch: () => void;
  onClearSelection: () => void;
};

export default function RemovePhonePopup({
  open,
  setOpen,
  phoneToRemove,
  onRefetch,
  onClearSelection,
}: RemovePhonePopupProps) {
  const [removePhoneNumber, { loading: removing }] = useMutation<
    boolean,
    RemoveUserPhoneNumberVariables
  >(REMOVE_USER_PHONE_NUMBER);

  const confirmRemovePhoneNumber = async () => {
    if (!phoneToRemove) return;

    try {
      await removePhoneNumber({
        variables: {
          id: phoneToRemove.id,
        },
      });
      setOpen(false);
      onClearSelection();
      onRefetch();
    } catch (err) {
      console.error("Error removing phone number:", err);
    }
  };

  return (
    <BasicPopup open={open} setOpen={setOpen}>
      <h2 className="text-xl font-semibold mb-4">Remove Phone Number</h2>
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to remove the phone number{" "}
          <strong>{phoneToRemove?.display}</strong>?
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This action cannot be undone. You will no longer receive notifications
          on this number.
        </p>
        <div className="flex gap-2 justify-end">
          <SimpleButton onClick={() => setOpen(false)}>Cancel</SimpleButton>
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
  );
}

"use client";
import ConfirmationButton from "@/components/common/ConfirmationButton";
import REQUEST_ACCOUNT_RESET from "@/graphql/ops/auth/mutations/REQUEST_ACCOUNT_RESET";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import Popup from "reactjs-popup";

export default function ResetFactor() {
  const [requestAccountReset, { loading: resetLoading }] = useMutation(
    REQUEST_ACCOUNT_RESET
  );
  return (
    <div className="p-2 text-center">
      <Popup
        trigger={
          <button className="text-sm font-semibold text-red-700 hover:underline">
            Forgot or Lost Your Factor?
          </button>
        }
        modal
      >
        <div className="p-2 text-center bg-secondary dark:text-white max-w-xl rounded-md">
          <h1 className="text-xl font-semibold">Reset Factor</h1>
          <ul className="list-disc list-inside text-left space-y-2 p-4">
            <li>
              If you have lost your one of your factors, you can authenticate
              with another factor and remove it.
            </li>
            <li>
              If you had only one factor, you unfortunately will have to reset
              your account and start over.
            </li>
            <li>
              After resetting your account, all your data will be erased and the
              data you've saved for beneficiaries will be deleted.
            </li>
            <li>
              After resetting your account, all your data will be erased and the
              data you've saved for beneficiaries will be deleted.
            </li>
            <li>
              Resetting account will take 24 hours to complete and you will
              receive email notification once it's done.
            </li>
          </ul>
          <ConfirmationButton
            onConfirm={() => {
              if (resetLoading) return;
              requestAccountReset()
                .then(() => {
                  toast.success(
                    "Reset request has been sent, Please check your email for further instructions."
                  );
                  setTimeout(() => {
                    window.location.reload();
                  }, 5000);
                })
                .catch((e) => {
                  toast.error(
                    "Something went wrong, Please contact support!!!"
                  );
                });
            }}
            className="py-2 px-4 rounded-md bg-red-700 text-white mb-4"
          >
            I've read and understood the above information and I want to reset
          </ConfirmationButton>
        </div>
      </Popup>
    </div>
  );
}

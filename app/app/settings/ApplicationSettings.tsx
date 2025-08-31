"use client";

import { useMutation } from "@apollo/client/react";
import DELETE_DATA from "../../../graphql/ops/auth/mutations/DELETE_DATA";
import DELETE_ACCOUNT from "../../../graphql/ops/auth/mutations/DELETE_ACCOUNT";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import { sleep } from "../../../common/time/sleep";
import FetchAllDataItems from "../../../components/debug/FetchAllDataItems";

export default function ApplicationSettings() {
  const { logout } = useAuth();
  const [deleteData] = useMutation(DELETE_DATA);
  const [deleteAccount] = useMutation(DELETE_ACCOUNT);
  return (
    <div className="w-full max-w-2xl m-auto flex flex-col justify-center px-2">
      <div className="flex items-center justify-between py-2">
        <div>
          <div>Delete All data</div>
          <div className="text-sm text-gray-500">
            This will delete all data items, smart will, peoples, factors
          </div>
        </div>
        <button
          data-cy="reset-account-button"
          className="bg-red-500 hover:bg-red-700 text-white px-2 rounded-sm"
          onClick={async () => {
            const cnf = confirm("Are you sure you want to delete all data");
            if (cnf) {
              await deleteData();
              toast.success("All data deleted");
              await sleep(2000);
              window.location.reload();
            }
          }}
        >
          Reset Account
        </button>
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <div>Delete My Account</div>
          <div className="text-sm text-gray-500">
            This will delete account, you will need to signup again
          </div>
        </div>
        <button
          data-cy="remove-account-button"
          className="bg-red-500 hover:bg-red-700 text-white px-2 rounded-sm"
          onClick={async () => {
            const cnf = confirm("Are you sure you want to delete your account");
            if (cnf) {
              await deleteAccount();
              toast.success("Deleted your account");
              await sleep(2000);
              logout();
            }
          }}
        >
          Delete Account
        </button>
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <div>Fetch all data items</div>
          <div className="text-sm text-gray-500">
            This will fetch all data models.
          </div>
        </div>

        <FetchAllDataItems />
      </div>
    </div>
  );
}

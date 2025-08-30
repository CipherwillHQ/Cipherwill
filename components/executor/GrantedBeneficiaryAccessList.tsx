"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "react-hot-toast";
import GET_ALL_GRANTED_BENEFICIARIES from "../../graphql/ops/app/executor/access/queries/GET_ALL_GRANTED_BENEFICIARIES";
import { GetAllGrantedBeneficiariesQuery } from "../../types/interfaces/metamodel";
import REVOKE_ACCESS_TO_MY_WILL from "../../graphql/ops/app/executor/access/mutations/REVOKE_ACCESS_TO_MY_WILL";
import getTimeRemaining from "../../common/time/getTimeRemaining";
import { UserById } from "../app/UserById";
import DevOnly from "../debug/DevOnly";

export default function GrantedBeneficiaryAccessList() {
  const { loading, error, data } = useQuery<GetAllGrantedBeneficiariesQuery>(GET_ALL_GRANTED_BENEFICIARIES);

  const [revokeAccess] = useMutation(REVOKE_ACCESS_TO_MY_WILL);

  if (loading) return null;
  if (error) return <div>Error : {JSON.stringify(error)}</div>;
  if (!data || data.getAllGrantedBeneficiaries.length === 0)
    return (
      <DevOnly>
        <div className="border p-2 text-sm rounded-md">
          Your smartwill is under the update schedule. None of your
          beneficiaries have access to your data and not aware about the update
          schedule.
        </div>
      </DevOnly>
    );

  return (
    <div>
      <h2 className="font-semibold py-2">
        Following beneficiaries have access to your data
      </h2>
      {data?.getAllGrantedBeneficiaries.map((access) => {
        return (
          <div
            key={access.id}
            className="flex items-center justify-between border rounded-md p-2 my-2"
          >
            <div>
              <div>
                <UserById id={access.user} /> has permission of your account
                {"'s"} data
              </div>
              <div>
                Access until: {getTimeRemaining(parseInt(access.expire_at))}
              </div>
            </div>
            <div
              className="bg-red-100 hover:bg-red-200 transition-colors py-1 px-4 text-red-700 mt-2 text-sm rounded-full 
              cursor-pointer w-min whitespace-nowrap"
              onClick={() => {
                const confirm = window.confirm(
                  `Are you sure you want to revoke access to ${access.user}?`
                );
                if (confirm) {
                  revokeAccess({
                    variables: {
                      id: access.id,
                    },
                    onCompleted: () => {
                      toast.success("Access revoked successfully");
                    },
                    refetchQueries: [
                      {
                        query: GET_ALL_GRANTED_BENEFICIARIES,
                      },
                    ],
                  });
                }
              }}
            >
              Revoke Access
            </div>
          </div>
        );
      })}
    </div>
  );
}

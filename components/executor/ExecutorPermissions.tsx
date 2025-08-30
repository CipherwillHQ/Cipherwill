"use client";
import { useQuery } from "@apollo/client/react";
import GET_ALL_BENEFICIARY_ACCESS from "../../graphql/ops/app/executor/access/queries/GET_ALL_BENEFICIARY_ACCESS";
import { GetAllBeneficiaryAccessQuery } from "../../types/interfaces/metamodel";
import getTimeRemaining from "../../common/time/getTimeRemaining";
import Link from "next/link";
import { UserById } from "../app/UserById";
import DevOnly from "../debug/DevOnly";

export default function ExecutorPermissions() {
  const { loading, error, data } = useQuery<GetAllBeneficiaryAccessQuery>(GET_ALL_BENEFICIARY_ACCESS);

  if (loading) return null;
  if (error) return <div>Error : {JSON.stringify(error)}</div>;

  return (
    <div>
      {data && data.getAllBeneficiaryAccess.length === 0 && (
        <DevOnly>
          <div className="border p-2 rounded-md text-sm">
            You do not have access as a beneficiary to anyones will
          </div>
        </DevOnly>
      )}
      {data &&
        data.getAllBeneficiaryAccess &&
        data.getAllBeneficiaryAccess.map((access) => {
          return (
            <div
              key={access.id}
              className="flex items-center justify-between bg-secondary border border-default rounded-md p-4"
            >
              <div>
                <div>
                  You have permissions of <UserById id={access.user} />
                  's Will
                </div>
                <div>
                  Access until: {getTimeRemaining(parseInt(access.expire_at))}
                </div>
              </div>
              <Link
                href={`/executor/${access.id}`}
                data-cy="executor-access-link"
              >
                <div
                  className="bg-green-100 hover:bg-green-200 transition-colors py-2 px-4 text-green-700 
                  mt-2 text-xs rounded-full cursor-pointer w-min"
                >
                  Access
                </div>
              </Link>
            </div>
          );
        })}
    </div>
  );
}

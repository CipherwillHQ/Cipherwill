"use client";

import { useMutation, useQuery } from "@apollo/client/react";

import DELETE_SMARTWILL_BENEFICIARY from "../../../graphql/ops/app/smartwill/mutations/DELETE_SMARTWILL_BENEFICIARY";
import DELETE_SMARTWILL_FRIEND from "../../../graphql/ops/app/smartwill/mutations/DELETE_SMARTWILL_FRIEND";
import GET_SMARTWILL_BENEFICIARY from "../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import GET_SMARTWILL_FRIENDS from "../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_FRIENDS";
import GET_PERSON_BY_IDS from "../../../graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import { 
  GetPersonByIdsData, 
  GetPersonByIdsVariables,
  DeleteSmartWillFriendData,
  DeleteSmartWillFriendVariables,
  DeleteSmartWillBeneficiaryData,
  DeleteSmartWillBeneficiaryVariables
} from "../../../types/interfaces/people";

export default function PersonListById({
  list,
  type,
}: {
  list: string[];
  type: string;
}) {
  const { loading, data, error } = useQuery<GetPersonByIdsData, GetPersonByIdsVariables>(GET_PERSON_BY_IDS, {
    variables: {
      list,
    },
  });
  const [deleteBeneficiary] = useMutation<DeleteSmartWillBeneficiaryData, DeleteSmartWillBeneficiaryVariables>(DELETE_SMARTWILL_BENEFICIARY);
  const [deleteFriend] = useMutation<DeleteSmartWillFriendData, DeleteSmartWillFriendVariables>(DELETE_SMARTWILL_FRIEND);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;

  if (!data || data.getPersonByIds.length === 0)
    return (
      <div className="text-gray-400" data-cy="no-friends">
        No Friends
      </div>
    );

  return (
    <div data-cy="friend-list" className="flex flex-col gap-2">
      {data.getPersonByIds.map((person) => {
        return (
          <div
            key={person.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-1"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div>
                <div className="font-medium">
                  {person.first_name} {person.last_name}
                </div>
                <div
                  data-cy="friend-email"
                  className="font-medium text-xs sm:text-sm"
                >
                  {person.email}
                </div>
              </div>
              {person.__typename === "Guest" && (
                <div className="text-xs text-left sm:text-center bg-black/60 text-white p-2 rounded-md">
                  This user is not registered on the platform.
                  <br />
                  Make sure to tell them to sign up.
                </div>
              )}
            </div>

            <button
              data-cy="remove-friend-button"
              className="flex items-center px-2 py-1 text-xs rounded-full border border-red-400 bg-red-100 hover:bg-red-200 text-black m-1 transition-colors"
              onClick={() => {
                const cnf = confirm(
                  "Are you sure you want to remove this person?"
                );
                if (!cnf) return;
                if (type === "beneficiary") {
                  deleteBeneficiary({
                    variables: {
                      id: person.id,
                    },
                    refetchQueries: [
                      {
                        query: GET_SMARTWILL_BENEFICIARY,
                      },
                    ],
                  });
                }

                if (type === "friend") {
                  deleteFriend({
                    variables: {
                      id: person.id,
                    },
                    refetchQueries: [
                      {
                        query: GET_SMARTWILL_FRIENDS,
                      },
                    ],
                  });
                }
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

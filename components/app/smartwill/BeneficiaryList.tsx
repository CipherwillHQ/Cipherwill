"use client";

import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import GET_SMARTWILL_BENEFICIARY from "../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import GET_PERSON_BY_IDS from "../../../graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import DELETE_SMARTWILL_BENEFICIARY from "../../../graphql/ops/app/smartwill/mutations/DELETE_SMARTWILL_BENEFICIARY";
import toast from "react-hot-toast";
import { useSession } from "../../../contexts/SessionContext";
import { useState } from "react";
import perform_migrate_in from "../../../common/factor/perform_migrate_in";
import GET_BENEFICIARY_KEY_COUNT from "../../../graphql/ops/auth/queries/GET_BENEFICIARY_KEY_COUNT";
import CustomMessage from "./CustomMessage";

export default function BeneficiaryList({ max_key_count, max_publicKey }) {
  const { loading, data, error } = useQuery(GET_SMARTWILL_BENEFICIARY);
  const { data: beneficiary_key_count } = useQuery(GET_BENEFICIARY_KEY_COUNT);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;

  return (
    data &&
    data.getSmartWillBeneficiaries && (
      <BeneficiaryListById
        beneficiaries={data.getSmartWillBeneficiaries}
        beneficiary_key_count={
          beneficiary_key_count && beneficiary_key_count.getBeneficiaryKeyCount
            ? beneficiary_key_count.getBeneficiaryKeyCount
            : null
        }
        max_key_count={max_key_count}
        max_publicKey={max_publicKey}
      />
    )
  );
}

function BeneficiaryListById({
  beneficiaries,
  beneficiary_key_count,
  max_key_count,
  max_publicKey,
}: {
  beneficiaries: any[];
  beneficiary_key_count: any[];
  max_key_count: number;
  max_publicKey: string;
}) {
  const { loading, data, error } = useQuery(GET_PERSON_BY_IDS, {
    variables: {
      list: beneficiaries.map((x) => x.person_id),
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;

  if (data.getPersonByIds.length === 0)
    return (
      <div className="text-gray-400" data-cy="no-beneficiaries">
        No Beneficiaries
      </div>
    );

  if (beneficiary_key_count === null) {
    return <div>Beneficiary data count is null</div>;
  }

  return (
    <div data-cy="beneficiary-list">
      {data.getPersonByIds.map((person) => {
        const beneficiary = beneficiaries.find(
          (x) => x.person_id === person.id
        );

        return (
          <PersonTile
            key={person.id}
            beneficiary={beneficiary}
            person={person}
            beneficiary_key_count={beneficiary_key_count}
            max_key_count={max_key_count}
            max_publicKey={max_publicKey}
          />
        );
      })}
    </div>
  );
}

function PersonTile({
  beneficiary,
  person,
  beneficiary_key_count,
  max_key_count,
  max_publicKey,
}) {
  const client = useApolloClient();
  const { session } = useSession();

  const [isMigrating, setIsMigrating] = useState(false);

  const [deleteBeneficiary] = useMutation(DELETE_SMARTWILL_BENEFICIARY);

  let minimum_count = 100000;

  const count = beneficiary_key_count.find(
    (x) => x.beneficiary_id === beneficiary.id
  );
  if (!beneficiary || !count) {
    return <div key={person.id}>Invalid Beneficiary data</div>;
  }
  if (count.factor_wise_count) {
    count.factor_wise_count.forEach((element) => {
      if (count.factor_wise_count.length > 1 && element.publicKey === "null") {
        // skip null factor if have another factors
        // do not count null factor if have another factors
        return;
      }
      if (element.count <= minimum_count) {
        minimum_count = element.count;
      }
    });
  }
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-1 bg-secondary rounded-md p-2 border border-default">
      <div className="p-1">
        <div>
          {person.first_name} {person.last_name}
        </div>
        <div data-cy="beneficiary-email" className="text-xs sm:text-sm">
          {person.email}
        </div>
      </div>
      {minimum_count === max_key_count && (
        <div className="p-1">
          <div data-cy="in-sync-status">In Sync</div>
          <span className="text-xs">
            Data Count: {minimum_count}/{max_key_count}
          </span>
        </div>
      )}
      {max_key_count !== minimum_count && (
        <button
          data-cy="requires-migration-button"
          className="flex items-center p-2 text-xs rounded-full border border-red-400 bg-red-100 hover:bg-red-200 text-black m-1 transition-colors"
          onClick={async () => {
            if (isMigrating) return;

            if (
              max_publicKey !== "null" &&
              session.publicKey !== max_publicKey
            ) {
              toast.error(
                "You need to login session with key " + max_publicKey.slice(-8)
              );
              return;
            }
            setIsMigrating(true);
            if (
              max_publicKey === "null" ||
              max_publicKey === session.publicKey
            ) {
              toast.success(
                `Migration Started from -> ${
                  max_publicKey === "null" ? "Unencrypted vault" : max_publicKey
                }`
              );
              await perform_migrate_in(
                max_publicKey,
                client,
                "dosent-matter-its-a-beneficiary-id-migration",
                session ? session.privateKey : null,
                beneficiary.id
              );

              // refetch query
              await client.query({
                query: GET_BENEFICIARY_KEY_COUNT,
                fetchPolicy: "network-only",
              });
              toast.success(
                `Migration Completed from -> ${
                  max_publicKey === "null" ? "Unencrypted vault" : max_publicKey
                }`
              );
              setIsMigrating(false);
            } else {
              toast.error(
                `You need to login with factor key: ${max_publicKey}`
              );
              setIsMigrating(false);
            }
          }}
        >
          {isMigrating && (
            <div
              data-cy="sync-status"
              className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-500 mr-2"
            />
          )}
          Requires Migration (My count: {max_key_count} | Beneficiary count:{" "}
          {minimum_count})
        </button>
      )}

      <div className="flex sm:flex-col items-start sm:items-end justify-center text-xs sm:text-sm gap-2">
        <CustomMessage
          beneficiary_id={beneficiary.id}
          custom_message={beneficiary.custom_message}
        />
        <button
          data-cy="remove-beneficiary-button"
          className="flex items-center px-2 py-1 text-sm rounded-full border border-red-400 bg-red-100 hover:bg-red-200 text-black transition-colors"
          onClick={() => {
            const cnf = confirm(
              "Are you sure you want to remove this beneficiary?"
            );
            if (cnf) {
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
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

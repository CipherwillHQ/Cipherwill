"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import toast from "react-hot-toast";
import { useSession } from "../../../../contexts/SessionContext";
import { useState } from "react";
import DELETE_SMARTWILL_BENEFICIARY from "../../../../graphql/ops/app/smartwill/mutations/DELETE_SMARTWILL_BENEFICIARY";
import GET_SMARTWILL_BENEFICIARY from "../../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import CustomMessage from "../CustomMessage";
import SimpleButton from "@/components/common/SimpleButton";
import ConfirmationPopup from "../ConfirmationPopup";
import {
  SmartWillBeneficiary,
  BeneficiaryKeyCount,
} from "../../../../types/interfaces/graphql";
import { Person } from "../../../../types/interfaces/people";
import {
  executeBeneficiaryMigration,
  getMigrationSessionError,
  getMigrationSourceLabel,
} from "./beneficiaryMigration";

export default function BeneficiaryPersonTile({
  beneficiary,
  person,
  beneficiary_key_count,
  max_key_count,
  max_publicKey,
}: {
  beneficiary: SmartWillBeneficiary | undefined;
  person: Person;
  beneficiary_key_count: BeneficiaryKeyCount[];
  max_key_count: number;
  max_publicKey: string;
}) {
  const client = useApolloClient();
  const { session } = useSession();

  const [isMigrating, setIsMigrating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [deleteBeneficiary] = useMutation(DELETE_SMARTWILL_BENEFICIARY);

  let minimum_count = 100000;

  if (!beneficiary) {
    return <div key={person.id}>Invalid Beneficiary data</div>;
  }

  const count = beneficiary_key_count.find(
    (x) => x.beneficiary_id === beneficiary.id
  );
  if (!count) {
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
    <div className="flex flex-col gap-2 md:flex-row justify-between items-start md:items-center my-1 bg-secondary rounded-md p-2 border border-default">
      <div className="py-1">
        <div>
          {person.first_name} {person.last_name}
        </div>
        <div data-cy="beneficiary-email" className="text-sm md:text-base">
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
        <>
          <div className="text-xs text-red-700">
            <span className="font-bold">Requires Migration</span>
            <br />
            My data count: {max_key_count} <br /> Beneficiary data count:{" "}
            {minimum_count}
          </div>
          <SimpleButton
            variant="danger"
            data-cy="requires-migration-button"
            onClick={async () => {
              if (isMigrating) return;

              const migrationError = getMigrationSessionError(
                max_publicKey,
                session.publicKey
              );
              if (migrationError) {
                toast.error(migrationError);
                return;
              }

              const migrationSource = getMigrationSourceLabel(max_publicKey);
              setIsMigrating(true);
              toast.success(`Migration Started from -> ${migrationSource}`);

              try {
                await executeBeneficiaryMigration({
                  client,
                  publicKey: max_publicKey,
                  privateKey: session.privateKey,
                  beneficiaryId: beneficiary.id,
                });
                toast.success(
                  `Migration Completed from -> ${migrationSource}`
                );
              } finally {
                setIsMigrating(false);
              }
            }}
          >
            {isMigrating && (
              <div
                data-cy="sync-status"
                className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white mr-2"
              />
            )}
            Click to Migrate
          </SimpleButton>
        </>
      )}

      <div className="flex md:flex-col items-center md:items-end justify-center gap-2">
        <CustomMessage
          beneficiary_id={beneficiary.id}
          custom_message={beneficiary.custom_message}
        />
        <button
          data-cy="remove-beneficiary-button"
          className="flex items-center hover:cursor-pointer px-2 py-1 text-sm rounded-full border border-red-400 bg-red-100 hover:bg-red-200 text-black transition-colors"
          onClick={() => {
            setShowDeleteConfirm(true);
          }}
        >
          Remove
        </button>
      </div>

      <ConfirmationPopup
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
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
        }}
        title="Remove Beneficiary"
        message={`Are you sure you want to remove ${
          person.first_name
            ? person.first_name
            : person.email
            ? person.email
            : "this person"
        } as a beneficiary? This action cannot be undone.`}
        confirmText="Remove Beneficiary"
        variant="danger"
      />
    </div>
  );
}

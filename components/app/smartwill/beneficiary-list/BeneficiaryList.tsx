"use client";

import { useQuery } from "@apollo/client/react";
import GET_SMARTWILL_BENEFICIARY from "../../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import GET_PERSON_BY_IDS from "../../../../graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import GET_BENEFICIARY_KEY_COUNT from "../../../../graphql/ops/auth/queries/GET_BENEFICIARY_KEY_COUNT";
import BeneficiaryPersonTile from "./BeneficiaryPersonTile";
import {
  SmartWillBeneficiariesData,
  BeneficiaryKeyCountData,
  SmartWillBeneficiary,
  BeneficiaryKeyCount,
} from "../../../../types/interfaces/graphql";
import { GetPersonByIdsData } from "../../../../types/interfaces/people";

export default function BeneficiaryList({
  max_key_count,
  max_publicKey,
}: {
  max_key_count: number;
  max_publicKey: string;
}) {
  const { loading, data, error } = useQuery<SmartWillBeneficiariesData>(
    GET_SMARTWILL_BENEFICIARY
  );
  const { data: beneficiary_key_count } = useQuery<BeneficiaryKeyCountData>(
    GET_BENEFICIARY_KEY_COUNT
  );
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
  beneficiaries: SmartWillBeneficiary[];
  beneficiary_key_count: BeneficiaryKeyCount[] | null;
  max_key_count: number;
  max_publicKey: string;
}) {
  const { loading, data, error } = useQuery<GetPersonByIdsData>(
    GET_PERSON_BY_IDS,
    {
      variables: {
        list: beneficiaries.map((x) => x.person_id),
      },
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;

  if (!data || data.getPersonByIds.length === 0)
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
          <BeneficiaryPersonTile
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

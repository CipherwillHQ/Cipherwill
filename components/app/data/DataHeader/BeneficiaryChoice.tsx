import PlanRestricted from "@/components/common/PlanRestricted";
import SimpleButton from "@/components/common/SimpleButton";
import GET_PERSON_BY_IDS from "@/graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import GET_SMARTWILL_BENEFICIARY from "@/graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import ADD_IGNORED_BENEFICIARY from "@/graphql/ops/app/metamodel/mutations/ADD_IGNORED_BENEFICIARY";
import REMOVE_IGNORED_BENEFICIARY from "@/graphql/ops/app/metamodel/mutations/REMOVE_IGNORED_BENEFICIARY";
import {
  GetPersonByIdsData,
  SmartWillBeneficiariesData,
  SmartWillBeneficiary,
} from "@/types";
import { useQuery, useMutation } from "@apollo/client/react";
import { BiCheckCircle } from "react-icons/bi";
import Popup from "reactjs-popup";

export default function BeneficiaryChoice({
  metamodel_id,
  ignored_beneficiaries,
}: {
  metamodel_id: string;
  ignored_beneficiaries: string[];
}) {
  const { loading, data, error } = useQuery<SmartWillBeneficiariesData>(
    GET_SMARTWILL_BENEFICIARY,
    {
      fetchPolicy: "network-only",
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;

  const popupTrigger = (
    <div className="hover:cursor-pointer flex items-center gap-2 border border-default text-sm py-1 px-4 rounded-full">
      {ignored_beneficiaries.length === 0 ? (
        <>
          <BiCheckCircle className="text-green-600" />
          All
        </>
      ) : (
        <>
          <BiCheckCircle className="text-gray-400" />
          {data && data.getSmartWillBeneficiaries
            ? data.getSmartWillBeneficiaries.length -
              ignored_beneficiaries.length
            : 0}{" "}
          of{" "}
          {data && data.getSmartWillBeneficiaries
            ? data.getSmartWillBeneficiaries.length
            : 0}{" "}
          beneficiaries
        </>
      )}
    </div>
  );
  return (
    <PlanRestricted
      placeholder={
        <Popup trigger={popupTrigger} position="bottom right">
          {/* @ts-ignore */}
          {(close) => {
            return (
              <div className="bg-secondary text-black dark:text-white p-2">
                <p className="text-sm pt-1 pb-2 border-b border-default">
                  You can choose which beneficiaries will get access to this
                  data item after your Cipherwill execution is triggered.
                </p>
                <div className="py-2">
                  <div className="text-sm">
                    This feature is available for Premium plan users. Please
                    upgrade your plan to access beneficiary choices.
                  </div>
                  <SimpleButton className="mt-2 w-full" href={"/app/billing"}>
                    Upgrade Plan
                  </SimpleButton>
                </div>
              </div>
            );
          }}
        </Popup>
      }
    >
      <Popup trigger={popupTrigger} position="bottom right">
        {/* @ts-ignore */}
        {(close) => {
          if (data && data.getSmartWillBeneficiaries.length === 0) {
            return (
              <div className="bg-secondary text-black dark:text-white p-3 max-h-[50vh] overflow-y-auto customScrollbar flex flex-col gap-2">
                <div>
                  You have no beneficiaries set up. Please add beneficiaries in
                  the Cipherwill section to manage beneficiary choices.
                </div>
                <SimpleButton href={"/app/beneficiaries"}>
                  Add Beneficiaries
                </SimpleButton>
              </div>
            );
          }
          return (
            <BeneficiaryList
              ignored_beneficiaries={ignored_beneficiaries}
              beneficiaries={
                data && data.getSmartWillBeneficiaries
                  ? data.getSmartWillBeneficiaries
                  : []
              }
              metamodel_id={metamodel_id}
            />
          );
        }}
      </Popup>
    </PlanRestricted>
  );
}

function BeneficiaryList({
  beneficiaries,
  metamodel_id,
  ignored_beneficiaries,
}: {
  beneficiaries: SmartWillBeneficiary[];
  metamodel_id?: string;
  ignored_beneficiaries: string[];
}) {
  const [addIgnoredBeneficiary] = useMutation(ADD_IGNORED_BENEFICIARY);
  const [removeIgnoredBeneficiary] = useMutation(REMOVE_IGNORED_BENEFICIARY);
  const { loading, data, error } = useQuery<GetPersonByIdsData>(
    GET_PERSON_BY_IDS,
    {
      variables: {
        list: beneficiaries.map((b) => b.person_id),
      },
      fetchPolicy: "network-only",
    }
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;
  if (!data) return <div>No Data</div>;
  const beneficiaries_persons = data.getPersonByIds;
  return (
    <div className="bg-secondary text-black dark:text-white p-2 max-h-[50vh] overflow-y-auto customScrollbar">
      <p className="text-sm pt-1 pb-2 border-b border-default">
        You can choose which beneficiaries will get access to this data item
        after your Cipherwill execution is triggered.
      </p>
      <div className="py-2">
        {beneficiaries.map((beneficiary) => {
          const person = beneficiaries_persons.find(
            (p) => p.id === beneficiary.person_id
          );
          if (!person) return null;

          return (
            <div
              key={beneficiary.id}
              className="flex items-center gap-2 hover:cursor-pointer rounded-md p-2 hover:bg-gray-500/20"
              onClick={() => {
                if (ignored_beneficiaries.includes(beneficiary.id)) {
                  if (metamodel_id) {
                    removeIgnoredBeneficiary({
                      variables: {
                        metamodel_id,
                        beneficiary_id: beneficiary.id,
                      },
                    });
                  }
                } else {
                  if (metamodel_id) {
                    addIgnoredBeneficiary({
                      variables: {
                        metamodel_id,
                        beneficiary_id: beneficiary.id,
                      },
                    });
                  }
                }
              }}
            >
              {ignored_beneficiaries.includes(beneficiary.id) ? (
                <BiCheckCircle className="text-gray-400 hover:text-green-600" />
              ) : (
                <BiCheckCircle className="text-green-600" />
              )}
              {person.first_name
                ? person.first_name.charAt(0).toUpperCase() +
                  person.first_name.slice(1) +
                  " " +
                  (person.last_name
                    ? person.last_name.charAt(0).toUpperCase() +
                      person.last_name.slice(1)
                    : "")
                : person.email}
            </div>
          );
        })}
      </div>
    </div>
  );
}

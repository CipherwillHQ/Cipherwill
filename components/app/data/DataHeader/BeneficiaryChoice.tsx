import PlanRestricted from "@/components/common/PlanRestricted";
import SimpleButton from "@/components/common/SimpleButton";
import GET_PERSON_BY_IDS from "@/graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import GET_SMARTWILL_BENEFICIARY from "@/graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import { GetPersonByIdsData, SmartWillBeneficiariesData } from "@/types";
import { useQuery } from "@apollo/client/react";
import { BiCheckCircle } from "react-icons/bi";
import Popup from "reactjs-popup";

const popupTrigger = (
  <div className="hover:cursor-pointer flex items-center gap-2 border border-default text-sm py-1 px-2 rounded-full">
    <BiCheckCircle className="text-green-600" />
    All
  </div>
);
export default function BeneficiaryChoice({
  metamodel_id,
}: {
  metamodel_id: string;
}) {
  const { loading, data, error } = useQuery<SmartWillBeneficiariesData>(
    GET_SMARTWILL_BENEFICIARY,
    {
      fetchPolicy: "network-only",
    }
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;
  return (
    <PlanRestricted
      placeholder={
        <Popup trigger={popupTrigger} position="bottom right">
          {/* @ts-ignore */}
          {(close) => {
            return (
              <div className="bg-secondary text-black dark:text-white p-2">
                <p className="text-sm pt-1 pb-2 border-b border-default">
                  You can choose which beneficiaries can access this data item.
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
          return (
            <BeneficiaryList
              beneficiary_ids={
                data && data.getSmartWillBeneficiaries
                  ? data.getSmartWillBeneficiaries.map((b) => b.person_id)
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
  beneficiary_ids,
  metamodel_id,
}: {
  beneficiary_ids: string[];
  metamodel_id?: string;
}) {
  const { loading, data, error } = useQuery<GetPersonByIdsData>(
    GET_PERSON_BY_IDS,
    {
      variables: {
        list: beneficiary_ids,
      },
      fetchPolicy: "network-only",
    }
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;
  if (!data) return <div>No Data</div>;
  const beneficiaries = data.getPersonByIds;
  return (
    <div className="bg-secondary text-black dark:text-white p-2 max-h-[50vh] overflow-y-auto customScrollbar">
      <p className="text-sm pt-1 pb-2 border-b border-default">
        You can choose which beneficiaries can access this data item.
      </p>
      <div className="py-2">
        {beneficiaries.map((beneficiary) => (
          <div
            key={beneficiary.id}
            className="flex items-center gap-2 hover:cursor-pointer p-1"
          >
            <BiCheckCircle className="text-green-600" />
            {beneficiary.first_name
              ? beneficiary.first_name.charAt(0).toUpperCase() +
                beneficiary.first_name.slice(1) +
                " " +
                (beneficiary.last_name
                  ? beneficiary.last_name.charAt(0).toUpperCase() +
                    beneficiary.last_name.slice(1)
                  : "")
              : beneficiary.email}
          </div>
        ))}
      </div>
    </div>
  );
}

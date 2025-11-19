import PlanRestricted from "@/components/common/PlanRestricted";
import SimpleButton from "@/components/common/SimpleButton";
import { BiCheckCircle } from "react-icons/bi";
import Popup from "reactjs-popup";

const popupTrigger = (
  <div className="hover:cursor-pointer flex items-center gap-2 border border-default text-sm py-1 px-2 rounded-full">
    <BiCheckCircle className="text-green-600" />
    All
  </div>
);
export default function BeneficiaryChoice() {
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
            <div className="bg-secondary text-black dark:text-white p-2">
              <p className="text-sm pt-1 pb-2 border-b border-default">
                You can choose which beneficiaries can access this data item.
              </p>
              <div className="py-2">
                {["beneficiary 1", "beneficiary 2", "beneficiary 3"].map(
                  (beneficiary) => (
                    <div
                      key={beneficiary}
                      className="flex items-center gap-2 hover:cursor-pointer p-1"
                    >
                      <BiCheckCircle className="text-green-600" />
                      {beneficiary}
                    </div>
                  )
                )}
              </div>
            </div>
          );
        }}
      </Popup>
    </PlanRestricted>
  );
}

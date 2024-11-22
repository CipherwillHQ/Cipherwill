import GET_SMARTWILL_BENEFICIARY from "@/graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import { BiCheckCircle, BiCircle } from "react-icons/bi";

export default function AddBeneficiaryStep() {
  const { loading, data, error } = useQuery(GET_SMARTWILL_BENEFICIARY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;

  const is_complete = data.getSmartWillBeneficiaries.length > 0;
  return (
    <div className="w-full max-w-sm">
      <Link
        className={`${is_complete ? "pointer-events-none" : ""}`}
        href={"/app/beneficiaries"}
      >
        <div className="flex items-center py-1">
          {is_complete ? (
            <BiCheckCircle className="text-green-500 mr-2" size={22} />
          ) : (
            <BiCircle className="text-gray-500 mr-2" size={22} />
          )}
          <span className="font-medium">Add a beneficiary</span>
        </div>
      </Link>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Add a beneficiary to your account as a nominee to receive your data if
        something unexpected happens to you.
      </div>
    </div>
  );
}

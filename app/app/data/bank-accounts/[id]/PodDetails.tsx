"use client";
import { useState } from "react";
import { BANK_ACCOUNT_TYPE } from "../../../../../types/pods/BANK_ACCOUNT";
import { usePod } from "@/contexts/PodHelper";
import DeleteButton from "./DeleteButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";

const BANK_ACCOUNT_SAMPLE: BANK_ACCOUNT_TYPE = {
  account_number: "6546489-SAMPLE",
  bank_name: "Sample Bank",
};

export default function PodDetails({ id }) {
  const [data, setData] = useState<BANK_ACCOUNT_TYPE>({});
  const { loading, error, updatePod, is_updating } = usePod<BANK_ACCOUNT_TYPE>(
    {
      TYPE: "bank_account",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: BANK_ACCOUNT_SAMPLE,
    },
    {
      onComplete: (data: null | BANK_ACCOUNT_TYPE) => {
        if (data) setData(data);
      },
    }
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre>
      <hr /> */}
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Account number"
        value={data.account_number || ""}
        onChange={(e) => {
          setData({
            ...data,
            account_number: e.target.value,
          });
        }}
      />{" "}
      <input
      className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Bank name"
        value={data.bank_name || ""}
        onChange={(e) => {
          setData({
            ...data,
            bank_name: e.target.value,
          });
        }}
      />
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          className="flex items-center justify-center gap-2 bg-black text-white font-bold py-2 px-4 rounded-sm w-full"
          onClick={() => {
            updatePod({
              bank_name: data.bank_name,
              account_number: data.account_number,
            });
          }}
        > {
          is_updating && 
          <LoadingIndicator/>
        }
        Save
        </button>
        <DeleteButton id={id} />
      </div>
    </div>
  );
}

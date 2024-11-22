"use client";
import { useState } from "react";
import { usePod } from "@/contexts/PodHelper";
import DeleteButton from "./DeleteButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { DEFI_STACKING_TYPE } from "@/types/pods/DEFI_STACKING";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const DEFI_STACKING_SAMPLE: DEFI_STACKING_TYPE = {
  platform: "AAVE",
  asset_amount: "100",
  asset_name: "USDC",
  lock_period: "1 month",
  wallet_address: "0x1234567890",
  username: "johndoe",
  password: "123456",
  note: "This is a sample note",
};

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEFI_STACKING_TYPE>({});
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, updatePod, is_updating } = usePod<DEFI_STACKING_TYPE>(
    {
      TYPE: "defi_staking",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: DEFI_STACKING_SAMPLE,
    },
    {
      onComplete: (data: null | DEFI_STACKING_TYPE) => {
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
        placeholder="Platform (AAVE, COMPOUND, etc.)"
        value={data.platform || ""}
        onChange={(e) => {
          setData({
            ...data,
            platform: e.target.value,
          });
        }}
      />{" "}
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Amount"
        value={data.asset_amount || ""}
        onChange={(e) => {
          setData({
            ...data,
            asset_amount: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Asset name (e.g. USDC)"
        value={data.asset_name || ""}
        onChange={(e) => {
          setData({
            ...data,
            asset_name: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Lock period (e.g. 1 month)"
        value={data.lock_period || ""}
        onChange={(e) => {
          setData({
            ...data,
            lock_period: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Wallet address"
        value={data.wallet_address || ""}
        onChange={(e) => {
          setData({
            ...data,
            wallet_address: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Username (if required)"
        value={data.username || ""}
        onChange={(e) => {
          setData({
            ...data,
            username: e.target.value,
          });
        }}
      />
      <div className="flex items-center gap-2">
        <input
          className="bg-secondary border border-default rounded-md p-2 w-full"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={data.password || ""}
          onChange={(e) => {
            setData({
              ...data,
              password: e.target.value,
            });
          }}
        />
        <div
          onClick={() => {
            setShowPassword((e) => !e);
          }}
        >
          {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
        </div>
      </div>
      <textarea
        className="bg-secondary border border-default rounded-md p-2"
        placeholder="Note"
        value={data.note || ""}
        onChange={(e) => {
          setData({
            ...data,
            note: e.target.value,
          });
        }}
      />{" "}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          className="flex items-center justify-center gap-2 bg-black text-white font-bold py-2 px-4 rounded w-full"
          onClick={() => {
            updatePod({
              platform: data.platform,
              asset_amount: data.asset_amount,
              asset_name: data.asset_name,
              lock_period: data.lock_period,
              wallet_address: data.wallet_address,
              username: data.username,
              password: data.password,
              note: data.note,
            });
          }}
        >
          {" "}
          {is_updating && <LoadingIndicator />}
          Save
        </button>
        <DeleteButton id={id} />
      </div>
    </div>
  );
}

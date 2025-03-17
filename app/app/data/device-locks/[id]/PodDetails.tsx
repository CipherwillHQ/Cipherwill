"use client";
import { useState } from "react";
import { usePod } from "@/contexts/PodHelper";
import DeleteButton from "./DeleteButton";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { DEVICE_LOCK_TYPE } from "@/types/pods/DEVICE_LOCK_TYPE";

const DEVICE_LOCK_SAMPLE: DEVICE_LOCK_TYPE = {
  password: "123456",
  pin: "123456",
  note: "Sample Note",
};

export default function PodDetails({ id }) {
  const [data, setData] = useState<DEVICE_LOCK_TYPE>({});
  const { loading, error, updatePod, is_updating } = usePod<DEVICE_LOCK_TYPE>(
    {
      TYPE: "device_lock",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: DEVICE_LOCK_SAMPLE,
    },
    {
      onComplete: (data: null | DEVICE_LOCK_TYPE) => {
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
        placeholder="Password"
        value={data.password || ""}
        onChange={(e) => {
          setData({
            ...data,
            password: e.target.value,
          });
        }}
      />{" "}
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Pin"
        value={data.pin || ""}
        onChange={(e) => {
          setData({
            ...data,
            pin: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Note"
        value={data.note || ""}
        onChange={(e) => {
          setData({
            ...data,
            note: e.target.value,
          });
        }}
      />
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          className="flex items-center justify-center gap-2 bg-black text-white font-bold py-2 px-4 rounded-sm w-full"
          onClick={() => {
            updatePod({
              password: data.password,
              pin: data.pin,
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

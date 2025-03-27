"use client";
import { useState } from "react";
import { usePod } from "@/contexts/PodHelper";
import DeleteButton from "./DeleteButton";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { PAYMENT_CARD_TYPE } from "@/types/pods/PAYMENT_CARD";

const PAYMENT_CARD_SAMPLE: PAYMENT_CARD_TYPE = {
  type: "Credit",
  card_holder_name: "John Doe",
  card_number: "1234567890123456",
  expiry_date: "12/2025",
  cvv: "123",
  issuer: "AB Bank",
  network: "Mastercard",
  note: "This is a note",
};

export default function PodDetails({ id }) {
  const [data, setData] = useState<PAYMENT_CARD_TYPE>({});
  const { loading, error, updatePod, is_updating } = usePod<PAYMENT_CARD_TYPE>(
    {
      TYPE: "payment_card",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: PAYMENT_CARD_SAMPLE,
    },
    {
      onComplete: (data: null | PAYMENT_CARD_TYPE) => {
        if (data) setData(data);
      },
    }
  );

  const [showPassword, setShowPassword] = useState(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre>
      <hr /> */}
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Type (e.g. Credit, Debit)"
        value={data.type || ""}
        onChange={(e) => {
          setData({
            ...data,
            type: e.target.value,
          });
        }}
      />
       <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Card Holder Name"
        value={data.card_holder_name || ""}
        onChange={(e) => {
          setData({
            ...data,
            card_holder_name: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Card Number"
        value={data.card_number || ""}
        onChange={(e) => {
          setData({
            ...data,
            card_number: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Expiry Date (e.g. 12/2025)"
        value={data.expiry_date || ""}
        onChange={(e) => {
          setData({
            ...data,
            expiry_date: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="CVV (e.g. 123)"
        value={data.cvv|| ""}
        onChange={(e) => {
          setData({
            ...data,
            cvv: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Issuer (e.g. AB Bank)"
        value={data.issuer|| ""}
        onChange={(e) => {
          setData({
            ...data,
            issuer: e.target.value,
          });
        }}
      />
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Network (e.g. Visa, Mastercard)"
        value={data.network|| ""}
        onChange={(e) => {
          setData({
            ...data,
            network: e.target.value,
          });
        }}
      />
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
          className="flex items-center justify-center gap-2 bg-black text-white font-bold py-2 px-4 rounded-sm w-full"
          onClick={() => {
            updatePod({
              type: data.type,
              card_holder_name: data.card_holder_name,
              card_number: data.card_number,
              expiry_date: data.expiry_date,
              cvv: data.cvv,
              issuer: data.issuer,
              network: data.network,
              note: data.note,
            });
          }}
        >
          {is_updating && <LoadingIndicator />}
          Save
        </button>
        <DeleteButton id={id} />
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { usePod } from "@/contexts/PodHelper";
import DeleteButton from "./DeleteButton";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import { PASSWORD } from "@/types/pods/PASSWORD";

const PASSWORD_SAMPLE: PASSWORD = {
  username: "john@example.com",
  password: "password",
  totp_secret: "123456",
  uri: ["https://example.com"],
  note: "Sample Note",
};

export default function PodDetails({ id }) {
  const [data, setData] = useState<PASSWORD>({});
  const { loading, error, updatePod, is_updating } = usePod<PASSWORD>(
    {
      TYPE: "password",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: PASSWORD_SAMPLE,
    },
    {
      onComplete: (data: null | PASSWORD) => {
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
        placeholder="Username"
        value={data.username || ""}
        onChange={(e) => {
          setData({
            ...data,
            username: e.target.value,
          });
        }}
      />{" "}
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
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="2FA Secret"
        value={data.totp_secret || ""}
        onChange={(e) => {
          setData({
            ...data,
            totp_secret: e.target.value,
          });
        }}
      />{" "}
      <div className="font-semibold">URIs</div>
      <div className="flex items-center gap-2">
        <input
          id="password-uri"
          className="bg-secondary border border-default rounded-md p-2 w-full"
          type="text"
          placeholder="URI (e.g., https://example.com)"
        />
        <button
          className="bg-secondary border border-default rounded-md p-2"
          onClick={() => {
            let new_uri = (
              document.getElementById("password-uri") as HTMLInputElement
            )?.value;
            // remove spaces
            new_uri = new_uri.trim();
            if (new_uri.length <= 0) {
              return;
            }

            setData({
              ...data,
              uri: Array.from(new Set([...(data.uri || []), new_uri])),
            });
            // clear the input
            (
              document.getElementById("password-uri") as HTMLInputElement
            ).value = "";
          }}
        >
          Add
        </button>
      </div>{" "}
      <div className="flex gap-2 flex-wrap">
        {(data.uri === undefined || data.uri?.length === 0) && (
          <div className="text-sm font-semibold text-neutral-500">No URIs</div>
        )}
        {data.uri?.map((uri, index) => (
          <div
            key={index}
            className="flex items-center gap-2 border border-default rounded-md p-2 "
          >
            <div>{uri}</div>
            <button
              onClick={() => {
                setData({
                  ...data,
                  uri: (data.uri || []).filter((code) => code !== uri),
                });
              }}
            >
              <TbTrash />
            </button>
          </div>
        ))}
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
          className="flex items-center justify-center gap-2 bg-black text-white font-bold py-2 px-4 rounded-sm w-full"
          onClick={() => {
            updatePod({
              username: data.username,
              password: data.password,
              totp_secret: data.totp_secret,
              uri: data.uri,
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

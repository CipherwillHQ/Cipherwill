"use client";
import { useState } from "react";
import { usePod } from "@/contexts/PodHelper";
import DeleteButton from "./DeleteButton";
import { EMAIL_ACCOUNT_TYPE } from "@/types/pods/EMAIL_ACCOUNT";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { TbTrash } from "react-icons/tb";
import LoadingIndicator from "@/components/common/LoadingIndicator";

const EMAIL_ACCOUNT_SAMPLE: EMAIL_ACCOUNT_TYPE = {
  email: "john@example.com",
  password: "password",
  provider: "Gmail",
  recoveryEmail: "john@example.com",
  recoveryPhone: "1234567890",
  securityQuestion: "What is your favorite color?",
  securityAnswer: "Blue",
  backupCodes: ["123456", "654321"],
  aliasEmails: ["john@example.com", "john.doe@example.com"],
  note: "Sample Note",
};

export default function PodDetails({ id }) {
  const [data, setData] = useState<EMAIL_ACCOUNT_TYPE>({});
  const { loading, error, updatePod, is_updating } = usePod<EMAIL_ACCOUNT_TYPE>(
    {
      TYPE: "email_account",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: EMAIL_ACCOUNT_SAMPLE,
    },
    {
      onComplete: (data: null | EMAIL_ACCOUNT_TYPE) => {
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
        type="email"
        placeholder="Email"
        value={data.email || ""}
        onChange={(e) => {
          setData({
            ...data,
            email: e.target.value,
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
        placeholder="Provider"
        value={data.provider || ""}
        onChange={(e) => {
          setData({
            ...data,
            provider: e.target.value,
          });
        }}
      />{" "}
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Recovery Email"
        value={data.recoveryEmail || ""}
        onChange={(e) => {
          setData({
            ...data,
            recoveryEmail: e.target.value,
          });
        }}
      />{" "}
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Recovery Phone"
        value={data.recoveryPhone || ""}
        onChange={(e) => {
          setData({
            ...data,
            recoveryPhone: e.target.value,
          });
        }}
      />{" "}
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Security Question"
        value={data.securityQuestion || ""}
        onChange={(e) => {
          setData({
            ...data,
            securityQuestion: e.target.value,
          });
        }}
      />{" "}
      <input
        className="bg-secondary border border-default rounded-md p-2"
        type="text"
        placeholder="Security Answer"
        value={data.securityAnswer || ""}
        onChange={(e) => {
          setData({
            ...data,
            securityAnswer: e.target.value,
          });
        }}
      />{" "}
      <div className="font-semibold">Backup codes</div>
      <div className="flex items-center gap-2">
        <input
          id="email-account-backup-codes"
          className="bg-secondary border border-default rounded-md p-2 w-full"
          type="text"
          placeholder="Backup Codes (comma separated)"
        />
        <button
          className="bg-secondary border border-default rounded-md p-2"
          onClick={() => {
            let newCodes = (
              document.getElementById(
                "email-account-backup-codes"
              ) as HTMLInputElement
            )?.value.split(",");
            // remove spaces
            newCodes = newCodes.map((code) => code.trim());
            // remove empty strings
            newCodes = newCodes.filter((code) => code !== "");

            setData({
              ...data,
              backupCodes: Array.from(
                new Set([...(data.backupCodes || []), ...newCodes])
              ),
            });
            // clear the input
            (
              document.getElementById(
                "email-account-backup-codes"
              ) as HTMLInputElement
            ).value = "";
          }}
        >
          Add
        </button>
      </div>{" "}
      <div className="flex gap-2 flex-wrap">
        {(data.backupCodes === undefined || data.backupCodes?.length === 0) && (
          <div className="text-sm font-semibold text-neutral-500">
            No backup codes
          </div>
        )}
        {data.backupCodes?.map((backupCode, index) => (
          <div
            key={index}
            className="flex items-center gap-2 border border-default rounded-md p-2 "
          >
            <div>{backupCode}</div>
            <button
              onClick={() => {
                setData({
                  ...data,
                  backupCodes: (data.backupCodes || []).filter(
                    (code) => code !== backupCode
                  ),
                });
              }}
            >
              <TbTrash />
            </button>
          </div>
        ))}
      </div>
      <div className="font-semibold">Email alias</div>
      <div className="flex items-center gap-2">
        <input
          id="email-account-alias-emails"
          className="bg-secondary border border-default rounded-md p-2 w-full"
          type="text"
          placeholder="Alias Emails (comma separated)"
        />
        <button
          className="bg-secondary border border-default rounded-md p-2"
          onClick={() => {
            let newAliases = (
              document.getElementById(
                "email-account-alias-emails"
              ) as HTMLInputElement
            )?.value.split(",");
            // remove spaces
            newAliases = newAliases.map((code) => code.trim());
            // remove empty strings
            newAliases = newAliases.filter((code) => code !== "");

            setData({
              ...data,
              aliasEmails: Array.from(
                new Set([...(data.aliasEmails || []), ...newAliases])
              ),
            });
            // clear the input
            (
              document.getElementById(
                "email-account-alias-emails"
              ) as HTMLInputElement
            ).value = "";
          }}
        >
          Add
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {(data.aliasEmails === undefined || data.aliasEmails?.length === 0) && (
          <div className="text-sm font-semibold text-neutral-500">
            No alias emails
          </div>
        )}
        {data.aliasEmails?.map((aliasEmail, index) => (
          <div
            key={index}
            className="flex items-center gap-2 border border-default rounded-md p-2 "
          >
            <div>{aliasEmail}</div>
            <button
              onClick={() => {
                setData({
                  ...data,
                  aliasEmails: (data.aliasEmails || []).filter(
                    (code) => code !== aliasEmail
                  ),
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
          className="flex items-center justify-center gap-2 bg-black text-white font-bold py-2 px-4 rounded w-full"
          onClick={() => {
            updatePod({
              email: data.email,
              password: data.password,
              provider: data.provider,
              recoveryEmail: data.recoveryEmail,
              recoveryPhone: data.recoveryPhone,
              securityQuestion: data.securityQuestion,
              securityAnswer: data.securityAnswer,
              backupCodes: data.backupCodes,
              aliasEmails: data.aliasEmails,
              note: data.note,
            });
          }}
        >
          {
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

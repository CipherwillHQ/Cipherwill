// Email Accounts PodDetails: form fields for email account data.
"use client";
import { useState } from "react";
import {
  EMAIL_ACCOUNT_TYPE,
  EMAIL_ACCOUNT_MANDATORY,
  EMAIL_ACCOUNT_OPTIONAL,
} from "@/types/pods/EMAIL_ACCOUNT";
import { usePod } from "@/contexts/PodHelper";
import SaveButton from "@/components/app/data/SaveButton";
import FormField from "@/components/app/data/FormField";
import ListField from "@/components/app/data/ListField";
import AddOptionalField from "@/components/app/data/AddOptionalField";
import { useOptionalFields } from "@/components/app/data/useOptionalFields";

const SAMPLE: EMAIL_ACCOUNT_TYPE = {
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

const MANDATORY = EMAIL_ACCOUNT_MANDATORY;
const OPTIONAL = EMAIL_ACCOUNT_OPTIONAL;

export default function PodDetails({ id }) {
  const [data, setData] = useState<EMAIL_ACCOUNT_TYPE>({});
  const [initialData, setInitialData] = useState<EMAIL_ACCOUNT_TYPE | null>(null);
  const { addField, removeField, visible, remaining } = useOptionalFields(
    OPTIONAL,
    data,
    setData
  );
  const { loading, error, savePod, is_updating } = usePod<EMAIL_ACCOUNT_TYPE>(
    {
      TYPE: "email_account",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: SAMPLE,
    },
    {
      onComplete: (d: null | EMAIL_ACCOUNT_TYPE) => {
        if (d) setData(d);
        setInitialData(JSON.parse(JSON.stringify(d || {})));
      },
    }
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-xl">
      {MANDATORY.map((f) => (
        <FormField
          key={f.key}
          label={f.label}
          type={f.type}
          sensitive={f.sensitive}
          placeholder={f.placeholder}
          required
          value={data[f.key]}
          onChange={(v) => setData({ ...data, [f.key]: v })}
        />
      ))}

      {visible.map((f) => {
        if (f.key === "backupCodes") {
          return (
            <ListField
              key="backupCodes"
              label={f.label}
              items={data.backupCodes || []}
              onChange={(items) => setData({ ...data, backupCodes: items })}
              onRemove={() => removeField("backupCodes")}
              placeholder="Backup Codes (comma separated)"
              emptyMessage="No backup codes"
            />
          );
        }
        if (f.key === "aliasEmails") {
          return (
            <ListField
              key="aliasEmails"
              label={f.label}
              items={data.aliasEmails || []}
              onChange={(items) => setData({ ...data, aliasEmails: items })}
              onRemove={() => removeField("aliasEmails")}
              placeholder="Alias Emails (comma separated)"
              emptyMessage="No alias emails"
            />
          );
        }
        return (
          <FormField
            key={f.key}
            label={f.label}
            type={f.type}
            sensitive={f.sensitive}
            placeholder={f.placeholder}
            value={data[f.key]}
            onChange={(v) => setData({ ...data, [f.key]: v })}
            onRemove={() => removeField(f.key)}
          />
        );
      })}

      <AddOptionalField fields={remaining} onAdd={addField} />

      <SaveButton
        data={data}
        initialData={initialData}
        isSaving={is_updating}
        onClick={async () => {
          await savePod(
            {
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
            },
            { metamodel_id: id }
          );
          setInitialData(JSON.parse(JSON.stringify(data)));
        }}
      />
    </div>
  );
}

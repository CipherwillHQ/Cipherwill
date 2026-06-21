// Passwords PodDetails: form fields for stored passwords.
"use client";
import { useState } from "react";
import {
  PASSWORD,
  PASSWORD_MANDATORY,
  PASSWORD_OPTIONAL,
} from "@/types/pods/PASSWORD";
import { usePod } from "@/contexts/PodHelper";
import LoadingIndicator from "@/components/common/LoadingIndicator";
import FormField from "@/components/app/data/FormField";
import ListField from "@/components/app/data/ListField";
import AddOptionalField from "@/components/app/data/AddOptionalField";
import { useOptionalFields } from "@/components/app/data/useOptionalFields";

const SAMPLE: PASSWORD = {
  username: "john@example.com",
  password: "password",
  totp_secret: "123456",
  uri: ["https://example.com"],
  note: "Sample Note",
};

const MANDATORY = PASSWORD_MANDATORY;
const OPTIONAL = PASSWORD_OPTIONAL;

export default function PodDetails({ id }) {
  const [data, setData] = useState<PASSWORD>({});
  const { addField, removeField, visible, remaining } = useOptionalFields(
    OPTIONAL,
    data,
    setData
  );
  const { loading, error, savePod, is_updating } = usePod<PASSWORD>(
    {
      TYPE: "password",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: SAMPLE,
    },
    {
      onComplete: (d: null | PASSWORD) => {
        if (d) setData(d);
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
          type={f.type as "text" | "email" | "textarea" | undefined}
          sensitive={f.sensitive}
          placeholder={f.placeholder}
          required
          value={String(data[f.key] || "")}
          onChange={(v) => setData({ ...data, [f.key]: v })}
        />
      ))}

      {visible.map((f) => {
        if (f.key === "uri") {
          return (
            <ListField
              key="uri"
              label={f.label}
              items={data.uri || []}
              onChange={(items) => setData({ ...data, uri: items })}
              onRemove={() => removeField("uri")}
              placeholder="Website (e.g., https://example.com)"
              emptyMessage="No Websites"
            />
          );
        }
        return (
          <FormField
            key={f.key}
            label={f.label}
            type={f.type as "text" | "email" | "textarea" | undefined}
            sensitive={f.sensitive}
            placeholder={f.placeholder}
            value={String(data[f.key] || "")}
            onChange={(v) => setData({ ...data, [f.key]: v })}
            onRemove={() => removeField(f.key)}
          />
        );
      })}

      <AddOptionalField fields={remaining} onAdd={addField} />

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          className="flex items-center justify-center gap-2 bg-black text-white font-bold py-2 px-4 rounded-sm w-full"
          onClick={() => {
            savePod(
              {
                username: data.username,
                password: data.password,
                totp_secret: data.totp_secret,
                uri: data.uri,
                note: data.note,
              },
              { metamodel_id: id }
            );
          }}
        >
          {is_updating && <LoadingIndicator />}
          Save
        </button>
      </div>
    </div>
  );
}

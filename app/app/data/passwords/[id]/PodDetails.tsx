"use client";
import { useState, useCallback } from "react";
import { usePod } from "@/contexts/PodHelper";
import { TbTrash } from "react-icons/tb";
import { PASSWORD } from "@/types/pods/PASSWORD";
import PodForm, { PodFieldConfig, PodCustomSectionDef } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";

const PASSWORD_SAMPLE: PASSWORD = {
  username: "john@example.com",
  password: "password",
  totp_secret: "123456",
  uri: ["https://example.com"],
  note: "Sample Note",
};

const PASSWORD_FIELDS: PodFieldConfig[] = [
  { key: "username", label: "Username", placeholder: "e.g. john@example.com", mandatory: false },
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", mandatory: false },
  { key: "totp_secret", label: "2FA Secret", placeholder: "e.g. 123456", mandatory: false },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", mandatory: false },
];

const PASSWORD_CUSTOM_SECTIONS: PodCustomSectionDef[] = [
  { key: "uri", label: "Websites", dataKey: "uri", mandatory: false },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<PASSWORD>({});
  const [initialData, setInitialData] = useState<PASSWORD | null>(null);
  const { loading, error, savePod, is_updating } = usePod<PASSWORD>(
    {
      TYPE: "password",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: PASSWORD_SAMPLE,
    },
    {
      onComplete: (data: null | PASSWORD) => {
        if (data) {
          setData(data);
          setInitialData(data);
        }
      },
    }
  );

  const handleRemoveCustomSection = useCallback((key: string) => {
    if (key === "uri") {
      setData((prev) => ({ ...prev, uri: undefined }));
    }
  }, []);

  const renderCustomSection = useCallback(
    (key: string) => {
      if (key === "uri") {
        return (
          <>
            <div className="font-semibold">Websites</div>
            <div className="flex items-center gap-2">
              <input
                id="password-uri"
                className="bg-secondary border border-default rounded-md p-2 w-full"
                type="text"
                placeholder="Website (e.g., https://example.com)"
              />
              <button
                className="bg-secondary border border-default rounded-md p-2"
                onClick={() => {
                  let new_uri = (
                    document.getElementById("password-uri") as HTMLInputElement
                  )?.value;
                  new_uri = new_uri.trim();
                  if (new_uri.length <= 0) {
                    return;
                  }

                  setData((prev) => ({
                    ...prev,
                    uri: Array.from(new Set([...(prev.uri || []), new_uri])),
                  }));
                  (
                    document.getElementById("password-uri") as HTMLInputElement
                  ).value = "";
                }}
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(data.uri === undefined || data.uri?.length === 0) && (
                <div className="text-sm font-semibold text-neutral-500">No Websites</div>
              )}
              {data.uri?.map((uri, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border border-default rounded-md p-2 "
                >
                  <div>{uri}</div>
                  <button
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        uri: (prev.uri || []).filter((code) => code !== uri),
                      }));
                    }}
                  >
                    <TbTrash />
                  </button>
                </div>
              ))}
            </div>
          </>
        );
      }
      return null;
    },
    [data]
  );

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  const handleSave = useCallback(async () => {
    try {
      await savePod({
        username: data.username,
        password: data.password,
        totp_secret: data.totp_secret,
        uri: data.uri,
        note: data.note,
      },{
        metamodel_id: id,
      });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch (_) {
    }
  }, [data, savePod, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 px-4 w-full max-w-lg mx-auto">
      <PodForm
        fields={PASSWORD_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
        customSections={PASSWORD_CUSTOM_SECTIONS}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <SaveButton
          isDirty={isDirty}
          isUpdating={is_updating}
          onClick={handleSave}
        />
      </div>
    </div>
  );
}

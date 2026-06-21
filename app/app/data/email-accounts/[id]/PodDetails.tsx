"use client";
import { useState, useCallback, useRef } from "react";
import { usePod } from "@/contexts/PodHelper";
import { EMAIL_ACCOUNT_TYPE } from "@/types/pods/EMAIL_ACCOUNT";
import { TbTrash } from "react-icons/tb";
import PodForm, { PodFieldConfig, PodCustomSectionDef, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { useMetamodelData } from "@/common/useMetamodelData";

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

const EMAIL_ACCOUNT_FIELDS: PodFieldConfig[] = [
  { key: "email", label: "Email", placeholder: "e.g. john@example.com", visibility: "mandatory" },
  { key: "password", label: "Password", type: "password", placeholder: "e.g. your password", visibility: "mandatory" },
  { key: "provider", label: "Provider", placeholder: "e.g. Gmail", visibility: "optional" },
  { key: "recoveryEmail", label: "Recovery Email", placeholder: "e.g. john@example.com", visibility: "skippable", group: { id: "recovery", label: "Recovery Info" } },
  { key: "recoveryPhone", label: "Recovery Phone", placeholder: "e.g. 1234567890", visibility: "skippable", group: { id: "recovery", label: "Recovery Info" } },
  { key: "securityQuestion", label: "Security Question", placeholder: "e.g. Your favorite color?", visibility: "skippable", group: { id: "security", label: "Security Info" } },
  { key: "securityAnswer", label: "Security Answer", placeholder: "e.g. Blue", visibility: "skippable", group: { id: "security", label: "Security Info" } },
  { key: "note", label: "Note", type: "textarea", placeholder: "e.g. Sample Note", visibility: "skippable" },
];

const EMAIL_ACCOUNT_CUSTOM_SECTIONS: PodCustomSectionDef[] = [
  { key: "backupCodes", label: "Backup Codes", dataKey: "backupCodes", visibility: "skippable" },
  { key: "aliasEmails", label: "Email Aliases", dataKey: "aliasEmails", visibility: "skippable" },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<EMAIL_ACCOUNT_TYPE>({});
  const [initialData, setInitialData] = useState<EMAIL_ACCOUNT_TYPE>({} as EMAIL_ACCOUNT_TYPE);
  const [previewOpen, setPreviewOpen] = useState(false);
  const podFormRef = useRef<PodFormHandle>(null);
  const metamodel = useMetamodelData(id);
  const { loading, error, savePod, is_updating } = usePod<EMAIL_ACCOUNT_TYPE>(
    {
      TYPE: "email_account",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: EMAIL_ACCOUNT_SAMPLE,
    },
    {
      onComplete: (data: null | EMAIL_ACCOUNT_TYPE) => {
        if (data) {
          setData(data);
          setInitialData(data);
        }
      },
    }
  );

  const handleRemoveCustomSection = useCallback((key: string) => {
    if (key === "backupCodes") {
      setData((prev) => ({ ...prev, backupCodes: undefined }));
    }
    if (key === "aliasEmails") {
      setData((prev) => ({ ...prev, aliasEmails: undefined }));
    }
  }, []);

  const renderCustomSection = useCallback(
    (key: string) => {
      if (key === "backupCodes") {
        return (
          <>
            <div className="font-semibold">Backup codes</div>
            <div className="flex items-center gap-2">
              <input
                id="email-account-backup-codes"
                className="bg-secondary border border-default rounded-xl p-2 w-full"
                type="text"
                placeholder="Backup Codes (comma separated)"
              />
              <button
                className="bg-secondary border border-default rounded-xl p-2"
                onClick={() => {
                  let newCodes = (
                    document.getElementById(
                      "email-account-backup-codes"
                    ) as HTMLInputElement
                  )?.value.split(",");
                  newCodes = newCodes.map((code) => code.trim());
                  newCodes = newCodes.filter((code) => code !== "");

                  setData((prev) => ({
                    ...prev,
                    backupCodes: Array.from(
                      new Set([...(prev.backupCodes || []), ...newCodes])
                    ),
                  }));
                  (
                    document.getElementById(
                      "email-account-backup-codes"
                    ) as HTMLInputElement
                  ).value = "";
                }}
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(data.backupCodes === undefined || data.backupCodes?.length === 0) && (
                <div className="text-sm font-semibold text-neutral-500">
                  No backup codes
                </div>
              )}
              {data.backupCodes?.map((backupCode, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border border-default rounded-xl p-2 "
                >
                  <div>{backupCode}</div>
                  <button
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        backupCodes: (prev.backupCodes || []).filter(
                          (code) => code !== backupCode
                        ),
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

      if (key === "aliasEmails") {
        return (
          <>
            <div className="font-semibold">Email alias</div>
            <div className="flex items-center gap-2">
              <input
                id="email-account-alias-emails"
                className="bg-secondary border border-default rounded-xl p-2 w-full"
                type="text"
                placeholder="Alias Emails (comma separated)"
              />
              <button
                className="bg-secondary border border-default rounded-xl p-2"
                onClick={() => {
                  let newAliases = (
                    document.getElementById(
                      "email-account-alias-emails"
                    ) as HTMLInputElement
                  )?.value.split(",");
                  newAliases = newAliases.map((code) => code.trim());
                  newAliases = newAliases.filter((code) => code !== "");

                  setData((prev) => ({
                    ...prev,
                    aliasEmails: Array.from(
                      new Set([...(prev.aliasEmails || []), ...newAliases])
                    ),
                  }));
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
                  className="flex items-center gap-2 border border-default rounded-xl p-2 "
                >
                  <div>{aliasEmail}</div>
                  <button
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        aliasEmails: (prev.aliasEmails || []).filter(
                          (code) => code !== aliasEmail
                        ),
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
      },{
        metamodel_id: id,
      });
      setInitialData(JSON.parse(JSON.stringify(data)));
    } catch (_) {
    }
  }, [data, savePod, id]);

  const addAndClose = (key: string) => {
    podFormRef.current?.addField(key);
    setPreviewOpen(false);
  };

  const isSkippable = (key: string) =>
    EMAIL_ACCOUNT_FIELDS.find((f) => f.key === key)?.visibility === "skippable";

  const isGroupSkippable = (groupId: string) =>
    EMAIL_ACCOUNT_FIELDS
      .filter((f) => f.group?.id === groupId)
      .every((f) => f.visibility === "skippable");

  function renderPreview(d: EMAIL_ACCOUNT_TYPE) {
    const canAdd = (key: string) => !isSkippable(key);
    const recoverySkippable = isGroupSkippable("recovery");
    const securitySkippable = isGroupSkippable("security");
    const hasRecovery = !!(d.recoveryEmail || d.recoveryPhone);
    const hasSecurity = !!d.securityQuestion;
    return (
      <PodPreviewSection>
        <p>
          {isSkippable("email") && !d.email ? (
            <>I have an email account {metamodel?.name || "..."}</>
          ) : (
            <>I have an email account{" "}
            <PreviewValue value={d.email} addLabel={canAdd("email") ? "Email" : undefined} onAdd={canAdd("email") ? () => addAndClose("email") : undefined} /></>
          )}, with the provider{" "}
          <PreviewValue value={d.provider} fallback="a provider" addLabel={canAdd("provider") ? "Provider" : undefined} onAdd={canAdd("provider") ? () => addAndClose("provider") : undefined} />,
          and the password is{" "}
          <PreviewValue value={d.password} sensitive />.
        </p>
        {!hasRecovery && !recoverySkippable ? (
          <p>
            I have recovery details set up{" "}
            <PreviewValue value="" addLabel="Recovery Info" onAdd={() => { podFormRef.current?.addGroup("recovery"); setPreviewOpen(false); }} />.
          </p>
        ) : hasRecovery ? (
          <>
            {d.recoveryEmail && (
              <p>
                I have a recovery email set up at{" "}
                <PreviewValue value={d.recoveryEmail} />.
              </p>
            )}
            {d.recoveryPhone && (
              <p>
                My recovery phone number is{" "}
                <PreviewValue value={d.recoveryPhone} />.
              </p>
            )}
          </>
        ) : null}
        {!hasSecurity && !securitySkippable ? (
          <p>
            I have security questions set up{" "}
            <PreviewValue value="" addLabel="Security Info" onAdd={() => { podFormRef.current?.addGroup("security"); setPreviewOpen(false); }} />.
          </p>
        ) : hasSecurity ? (
          <p>
            For security, my question is{" "}
            &ldquo;<PreviewValue value={d.securityQuestion} />&rdquo;{" "}
            and the answer is{" "}
            <PreviewValue value={d.securityAnswer} sensitive />.
          </p>
        ) : null}
        {d.backupCodes && d.backupCodes.length > 0 && (
          <p>
            I have these backup codes saved:{" "}
            <span className="font-semibold text-forest dark:text-cream">
              {d.backupCodes.join(", ")}
            </span>
            .
          </p>
        )}
        {d.aliasEmails && d.aliasEmails.length > 0 && (
          <>
            <p>This account also has these email aliases:</p>
            <ul className="list-disc list-inside pl-2 space-y-0.5">
              {d.aliasEmails.map((email, i) => (
                <li key={i} className="font-semibold text-forest dark:text-cream">
                  {email}
                </li>
              ))}
            </ul>
          </>
        )}
        {(d.note || !isSkippable("note")) && (
          <p>
            For context, <PreviewValue value={d.note} addLabel={canAdd("note") ? "Note" : undefined} onAdd={canAdd("note") ? () => addAndClose("note") : undefined} />.
          </p>
        )}
      </PodPreviewSection>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PodFormLayout
      preview={renderPreview(data)}
      previewOpen={previewOpen}
      onTogglePreview={() => setPreviewOpen(!previewOpen)}
      isDirty={isDirty}
      saveButton={<SaveButton isDirty={isDirty} isUpdating={is_updating} onClick={handleSave} />}
    >
      <PodForm
        ref={podFormRef}
        fields={EMAIL_ACCOUNT_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
        customSections={EMAIL_ACCOUNT_CUSTOM_SECTIONS}
        renderCustomSection={renderCustomSection}
        onRemoveCustomSection={handleRemoveCustomSection}
      />
    </PodFormLayout>
  );
}

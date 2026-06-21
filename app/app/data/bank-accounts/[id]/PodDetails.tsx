"use client";
import { useState, useCallback, useRef } from "react";
import { BANK_ACCOUNT_TYPE } from "../../../../../types/pods/BANK_ACCOUNT";
import { usePod } from "@/contexts/PodHelper";
import PodForm, { PodFieldConfig, PodFormHandle } from "@/components/common/PodForm";
import SaveButton from "@/components/common/SaveButton";
import PodFormLayout from "@/components/pods/PodFormLayout";
import PodPreviewSection, { PreviewValue } from "@/components/pods/PodPreview";
import { useMetamodelData } from "@/common/useMetamodelData";

const BANK_ACCOUNT_SAMPLE: BANK_ACCOUNT_TYPE = {
  account_number: "6546489-SAMPLE",
  bank_name: "Sample Bank",
};

const BANK_ACCOUNT_FIELDS: PodFieldConfig[] = [
  { key: "account_number", label: "Account number", placeholder: "e.g. 6546489", visibility: "mandatory" },
  { key: "bank_name", label: "Bank name", placeholder: "e.g. Sample Bank", visibility: "mandatory" },
];

export default function PodDetails({ id }) {
  const [data, setData] = useState<BANK_ACCOUNT_TYPE>({});
  const [initialData, setInitialData] = useState<BANK_ACCOUNT_TYPE>({} as BANK_ACCOUNT_TYPE);
  const [previewOpen, setPreviewOpen] = useState(false);
  const podFormRef = useRef<PodFormHandle>(null);
  const metamodel = useMetamodelData(id);
  const { loading, error, savePod, is_updating } = usePod<BANK_ACCOUNT_TYPE>(
    {
      TYPE: "bank_account",
      VERSION: "0.0.1",
      REF_ID: id,
      DATA_SAMPLE: BANK_ACCOUNT_SAMPLE,
    },
    {
      onComplete: (data: null | BANK_ACCOUNT_TYPE) => {
        if (data) {
          setData(data);
          setInitialData(data);
        }
      },
    }
  );

  const isDirty = JSON.stringify(initialData) !== JSON.stringify(data);

  const handleSave = useCallback(async () => {
    try {
      await savePod({
        bank_name: data.bank_name,
        account_number: data.account_number,
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

  function renderPreview(d: BANK_ACCOUNT_TYPE) {
    return (
      <PodPreviewSection>
        <p>
          I have a {metamodel?.name || "bank account"} with{" "}
          <PreviewValue value={d.bank_name} addLabel="Bank name" onAdd={() => addAndClose("bank_name")} />,
          account number{" "}
          <PreviewValue value={d.account_number} addLabel="Account number" onAdd={() => addAndClose("account_number")} />.
        </p>
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
        fields={BANK_ACCOUNT_FIELDS}
        data={data}
        onChange={(key, value) => {
          setData((prev) => ({ ...prev, [key]: value }));
        }}
      />
    </PodFormLayout>
  );
}

// Renders shared notes and account data using the existing decryption hook.
// Owns query states and read-only content presentation for a single item.
// Does not change encryption, save data, or expose editing actions.

"use client";

import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { executorFields, isExecutorFieldSensitive } from "@/common/executor/fields";
import { getExecutorSegment } from "@/common/executor/segments";
import useDecryptedPod from "@/common/executor/hooks/useDecryptedPod";
import { parseMetamodelMetadata } from "@/common/metamodel/utils";
import sanitizeHtml from "@/common/security/sanitizeHtml";
import PodDetailsSkeleton from "@/components/app/data/PodDetailsSkeleton";
import GET_GRANTED_METAMODEL from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import type { GrantedDataContentProps, GrantedMetamodel, GetGrantedMetamodelQuery, GetGrantedMetamodelVariables } from "@/types/interfaces";
import ExecutorDetailsLayout from "./ExecutorDetailsLayout";
import ExecutorField from "./ExecutorField";
import ExecutorState from "./ExecutorState";

export default function GrantedDataContent({ slug, accessId, modelId }: GrantedDataContentProps) {
  const [decryptedValue, setDecryptedValue] = useState<Record<string, string | string[] | undefined> | string | null>(null);
  const [keyMetadata, setKeyMetadata] = useState<Pick<GrantedMetamodel, "created_at" | "updated_at"> | null>(null);
  const { data: keyData, loading: decryptionLoading, error: decryptionError, isEmpty } = useDecryptedPod({
    access_id: accessId,
    metamodel_id: modelId,
    setData: setDecryptedValue,
    setKeyMetadata,
  });
  const { data, loading, error } = useQuery<GetGrantedMetamodelQuery, GetGrantedMetamodelVariables>(
    GET_GRANTED_METAMODEL,
    { variables: { access_id: accessId, model_id: modelId } },
  );
  const model = data?.getGrantedMetamodel;

  if (error || decryptionError || (!decryptionLoading && !isEmpty && keyData?.getKeyByRefId === null) || (!loading && !model)) {
    return <ExecutorState error title="This item is unavailable" description="The shared details could not be opened. You can choose another item from the sidebar." />;
  }
  if (!model) return <div role="status" aria-label="Loading shared details"><PodDetailsSkeleton /></div>;

  const metadata = parseMetamodelMetadata(model);
  const segment = getExecutorSegment(slug);
  const note = typeof decryptedValue === "object" && decryptedValue ? String(decryptedValue.content ?? "") : "";

  return (
    <ExecutorDetailsLayout title={metadata.title || metadata.name || "Untitled"} subtitle={segment.title} createdAt={keyMetadata?.created_at ?? model.created_at} updatedAt={keyMetadata?.updated_at ?? model.updated_at}>
      {isEmpty ? (
        <ExecutorState title="No details saved" description="This item was created without any saved details." />
      ) : decryptedValue === null ? (
        <div role="status" aria-label="Decrypting shared details"><PodDetailsSkeleton /></div>
      ) : slug === "notes" ? (
        <article className="select-text rounded-2xl border border-default bg-secondary p-6 leading-relaxed">
          {typeof decryptedValue === "string" ? (
            <p className="whitespace-pre-wrap">{decryptedValue}</p>
          ) : (
            <div data-cy="donor-note-content" className="break-words [&_p]:mb-3 [&_li]:ml-5 [&_ul]:list-disc [&_ol]:list-decimal" dangerouslySetInnerHTML={{ __html: sanitizeHtml(note) }} />
          )}
        </article>
      ) : (
        <dl className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {executorFields[slug].map((field) => {
            const value = typeof decryptedValue === "object" ? decryptedValue[field.key] : undefined;
            if (value == null || value === "" || (Array.isArray(value) && !value.length)) return null;
            return <ExecutorField key={field.key} label={field.label} value={value} sensitive={isExecutorFieldSensitive(field)} monospace={field.key === "public_key" || field.key === "wallet_address"} />;
          })}
        </dl>
      )}
    </ExecutorDetailsLayout>
  );
}

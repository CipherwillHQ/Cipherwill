// Renders a shared file's identity and download action.
// Owns metadata presentation and file query states.
// Does not decrypt or download files directly.

"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import GET_GRANTED_METAMODEL from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import { TbDownload } from "react-icons/tb";
import { parseMetamodelMetadata } from "@/common/metamodel/utils";
import ExecutorDetailsLayout from "@/components/executor/ExecutorDetailsLayout";
import ExecutorState from "@/components/executor/ExecutorState";
import PodDetailsSkeleton from "@/components/app/data/PodDetailsSkeleton";
import DownloadGrantedObject from "./DownloadGrantedObject";
import type { 
  GetGrantedMetamodelQuery, 
  GetGrantedMetamodelVariables 
} from "@/types/interfaces";

export default function ExecutorObjectView() {
  const params = useParams() as { id: string; model_id: string };
  const access_id: string = params?.id;
  const object_id: string = params?.model_id;

  const { data: granted_metamodel, loading, error } = useQuery<GetGrantedMetamodelQuery, GetGrantedMetamodelVariables>(
    GET_GRANTED_METAMODEL, 
    {
      variables: {
        access_id,
        model_id: object_id,
      },
    }
  );

  if (loading) return <div role="status" aria-label="Loading shared file"><PodDetailsSkeleton /></div>;
  if (error || !granted_metamodel?.getGrantedMetamodel) return <ExecutorState error title="This file is unavailable" description="The shared file could not be opened. You can choose another item from the sidebar." />;

  const keyMetadata = granted_metamodel.getGrantedMetamodel;
  const parsed_data = parseMetamodelMetadata(keyMetadata);

  return (
    <ExecutorDetailsLayout title={parsed_data.title || "Untitled"} subtitle="Shared file" createdAt={keyMetadata.created_at} updatedAt={keyMetadata.updated_at}>
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-default bg-secondary p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary dark:bg-darkAccent dark:text-primary-300"><TbDownload size={26} /></div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Download shared file</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Save a copy of this file during your access period.</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{parsed_data.type || "File"}</p>
        </div>
        <div className="[&_button]:min-h-11 [&_button]:rounded-xl [&_button]:px-5 [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-primary">
          <DownloadGrantedObject ref_id={object_id} access_id={access_id} />
        </div>
      </div>
    </ExecutorDetailsLayout>
  );
}

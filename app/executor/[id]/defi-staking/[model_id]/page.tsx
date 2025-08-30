"use client";

import { useQuery } from "@apollo/client/react";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import { useState } from "react";
import GET_GRANTED_METAMODEL from "../../../../../graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import { useParams } from "next/navigation";
import useDecryptedPod from "@/common/executor/hooks/useDecryptedPod";
import { DEFI_STACKING } from "@/types/pods/DEFI_STAKING";
import type { 
  GetGrantedMetamodelQuery, 
  GetGrantedMetamodelVariables,
  MetamodelMetadata 
} from "@/types/interfaces/metamodel";

export default function ExecutorDefiStakingView() {
  const params = useParams();
  const access_id: string = params?.id as string;
  const defi_stacking_id: string = params?.model_id as string;

  const [decryptedValue, setDecryptedValue] =
    useState<DEFI_STACKING | null>(null);

  const [keyMetadata, setKeyMetadata] = useState<{
    created_at: string;
    updated_at: string;
  } | null>(null);
  useDecryptedPod({
    access_id,
    metamodel_id: defi_stacking_id,
    setData(data) {
      setDecryptedValue(data);
    },
    setKeyMetadata(data) {
      setKeyMetadata(data);
    },
  });

  const { data: granted_metamodel, loading, error } = useQuery<GetGrantedMetamodelQuery, GetGrantedMetamodelVariables>(GET_GRANTED_METAMODEL, {
    variables: {
      access_id,
      model_id: defi_stacking_id,
    },
  });

  if (loading) return <div>Loading Granted Models...</div>;
  if (error) return <div>Error loading granted model: {error.message}</div>;
  if (!granted_metamodel?.getGrantedMetamodel) return <div>No granted model found</div>;

  const parsed_data: MetamodelMetadata = JSON.parse(
    granted_metamodel.getGrantedMetamodel.metadata
  );

  return (
    <div className="w-full">
      <div className="p-2">
        Title : {parsed_data.name || "Untitled"}
        <br />
        {keyMetadata && (
          <div>
            Created At: {getTimeAgo(parseInt(keyMetadata.created_at))}
            <br />
            Updated At : {getTimeAgo(parseInt(keyMetadata.updated_at))}
          </div>
        )}
        <div className="border-b my-2" />
        Content :
        <br />
        {decryptedValue != null && (
          <div className="whitespace-pre-line bg-secondary p-2">
            {JSON.stringify(decryptedValue, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
}

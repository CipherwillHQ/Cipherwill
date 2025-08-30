"use client";

import { useQuery } from "@apollo/client/react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import GET_GRANTED_METAMODEL from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import getTimeAgo from "@/common/time/getTimeAgo";
import DownloadGrantedObject from "./DownloadGrantedObject";
import type { 
  GetGrantedMetamodelQuery, 
  GetGrantedMetamodelVariables 
} from "@/types/interfaces/metamodel";

export default function ExecutorObjectView() {
  const params = useParams() as { id: string; model_id: string };
  const access_id: string = params?.id;
  const object_id: string = params?.model_id;

  const [keyMetadata, setKeyMetadata] = useState<any | null>(null);

  const { data: granted_metamodel, loading, error } = useQuery<GetGrantedMetamodelQuery, GetGrantedMetamodelVariables>(
    GET_GRANTED_METAMODEL, 
    {
      variables: {
        access_id,
        model_id: object_id,
      },
    }
  );

  useEffect(() => {
    if (granted_metamodel?.getGrantedMetamodel) {
      setKeyMetadata(granted_metamodel.getGrantedMetamodel);
    }
  }, [granted_metamodel]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!granted_metamodel?.getGrantedMetamodel) return <div>No data available</div>;

  const parsed_data = JSON.parse(
    granted_metamodel.getGrantedMetamodel.metadata
  );

  return (
    <div className="w-full">
      <div className="p-2">
        Title : {parsed_data.title || "Untitled"}
        <br />
        Type: {parsed_data.type || "Untyped"}
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
        <DownloadGrantedObject ref_id={object_id} access_id={access_id}/>
      </div>
    </div>
  );
}

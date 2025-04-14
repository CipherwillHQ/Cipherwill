"use client";

import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useParams } from "next/navigation";
import GET_GRANTED_METAMODEL from "@/graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import getTimeAgo from "@/common/time/getTimeAgo";
import DownloadGrantedObject from "./DownloadGrantedObject";

export default function DonorObjectView() {
  const params = useParams();
  const access_id: string = params.id as string;
  const object_id: string = params.model_id as string;

  const [keyMetadata, setKeyMetadata] = useState(null);


  const { data: granted_metamodel } = useQuery(GET_GRANTED_METAMODEL, {
    variables: {
      access_id,
      model_id: object_id,
    },
    onCompleted(data) {
      const keyMetadata = data?.getGrantedMetamodel;
      if (!keyMetadata) return;
      setKeyMetadata(keyMetadata);
    },
  });
  if (!granted_metamodel) return <div>Loading Granted Models...</div>;

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

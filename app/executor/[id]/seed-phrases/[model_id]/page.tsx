"use client";

import { useQuery } from "@apollo/client";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import { useState } from "react";
import GET_GRANTED_METAMODEL from "../../../../../graphql/ops/app/executor/metamodels/GET_GRANTED_METAMODEL";
import { useParams } from "next/navigation";
import useDecryptedPod from "@/common/executor/hooks/useDecryptedPod";
import { SEED_PHRASE_TYPE } from "@/types/pods/SEED_PHRASE";

export default function DonorNoteView() {
  const params = useParams();
  const access_id: string = params?.id as string;
  const seed_phrase_id: string = params?.model_id as string;

  const [decryptedValue, setDecryptedValue] =
    useState<SEED_PHRASE_TYPE | null>(null);

  const [keyMetadata, setKeyMetadata] = useState<any|null>(null);
  useDecryptedPod({
    access_id,
    metamodel_id: seed_phrase_id,
    setData(data) {
      setDecryptedValue(data);
    },
    setKeyMetadata(data) {
      setKeyMetadata(data);
    },
  });

  const { data: granted_metamodel } = useQuery(GET_GRANTED_METAMODEL, {
    variables: {
      access_id,
      model_id: seed_phrase_id,
    },
  });
  if (!granted_metamodel) return <div>Loading Granted Models...</div>;

  const parsed_data = JSON.parse(
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

"use client";
import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { BiEditAlt } from "react-icons/bi";
import GET_METAMODEL from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import UPDATE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import ShareMetapod from "@/components/app/data/ShareMetapod";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import DeleteButton from "./DeleteButton";

export default function MetaDetails({ id }) {
  const { data, loading, error, refetch } = useQuery(GET_METAMODEL, {
    variables: {
      id,
    },
    onError(error) {
      if (
        error &&
        error.graphQLErrors &&
        error.graphQLErrors[0] &&
        error.graphQLErrors[0].extensions?.code === "MODEL_NOT_FOUND"
      ) {
        window.location.href = "/app/data/storage";
      }
    },
  });

  const [update_metamodel] = useMutation(UPDATE_METAMODEL, {
    onCompleted: () => {
      refetch();
    },
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  const file_details = data.getMetamodel;
  const parsedData = JSON.parse(data.getMetamodel.metadata);

  return (
    <div className="flex flex-col gap-2">
      <DesktopAndMobilePageHeader
        title="File Details"
        backPath={
          file_details.folder_id === "root"
            ? "/app/data/storage"
            : `/app/data/storage/folder/${file_details.folder_id}`
        }
      />
      <div className="flex flex-col sm:flex-row items-center gap-2 justify-between px-4 py-2">
        <div className="flex gap-2 items-center">
          <div
            id="file-title"
            contentEditable
            suppressContentEditableWarning
            className="text-xl outline-hidden"
            onBlur={(e) => {
              const new_name = e.target.innerText;
              if (new_name.length === 0) {
                const titleElement = document.getElementById("file-title");
                if (titleElement) {
                  titleElement.innerText = parsedData.name;
                }
              }
              if (new_name.length > 0 && new_name !== parsedData.title) {
                update_metamodel({
                  variables: {
                    data: {
                      id,
                      metadata: JSON.stringify({
                        ...parsedData,
                        title: new_name,
                      }),
                    },
                  },
                });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById("file-title")?.blur();
              }
            }}
          >
            {parsedData.title}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              document.getElementById("file-title")?.focus();
            }}
          >
            Rename
          </button>
          <ShareMetapod />

          <div className="text-xs">
            Created at: {getTimeAgo(parseInt(data.getMetamodel.created_at))}
            <br />
            Updated at: {getTimeAgo(parseInt(data.getMetamodel.updated_at))}
          </div>
        </div>
      </div>
      <div className="text-sm px-4">type: {parsedData.type}</div>
      <div className="px-4">
        <DeleteButton
          id={data.getMetamodel.id}
          folder_id={data.getMetamodel.folder_id}
        />
      </div>
    </div>
  );
}

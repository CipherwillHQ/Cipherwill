"use client";
import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { BiEditAlt } from "react-icons/bi";
import GET_METAMODEL from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import UPDATE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import ShareMetapod from "@/components/app/data/ShareMetapod";
import Options from "./Options";

export default function MetaDetails({
  id,
  saveStatus,
}: {
  id: string;
  saveStatus: "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING";
}) {
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
        window.location.href = "/app/data/notes";
      }
    },
  });

  const [update_metamodel] = useMutation(UPDATE_METAMODEL, {
    onCompleted: () => {
      refetch();
    },
  });
  if (loading)
    return (
      <div className="bg-neutral-300 dark:bg-neutral-800 p-2 rounded-md my-2 h-10 animate-pulse" />
    );
  if (error) return <div>{JSON.stringify(error)}</div>;
  const parsedData = JSON.parse(data.getMetamodel.metadata);

  return (
    <div className="flex items-start gap-2 justify-between py-2">
      <div className="flex gap-2 items-center">
        <div
          id="note-title"
          className="text-xl outline-hidden"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const new_name = e.target.innerText;
            if (new_name.length === 0) {
              const titleElement = document.getElementById("note-title");
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
              document.getElementById("note-title")?.blur();
            }
          }}
        >
          {parsedData.title.length > 0 ? parsedData.title : "Untitled"}
        </div>
        <div className="ml-2 text-xs">
          {saveStatus === "SAVED"
            ? ""
            : saveStatus === "LOADING"
            ? "Saving..."
            : saveStatus === "NOT_SAVED"
            ? "Edited"
            : "Error saving"}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ShareMetapod />
        <Options model={data.getMetamodel} />
      </div>
    </div>
  );
}

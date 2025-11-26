"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";
import { BiEditAlt } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import Popup from "reactjs-popup";
import GET_METAMODEL from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import UPDATE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import ShareMetapod from "@/components/app/data/ShareMetapod";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import DeleteButton from "./DeleteButton";
import {
  GetMetamodelQuery,
  GetMetamodelVariables,
  UpdateMetamodelMutation,
  UpdateMetamodelVariables,
  MetamodelMetadata,
} from "../../../../../types/interfaces";
import {
  parseMetamodelMetadata,
  stringifyMetamodelMetadata,
} from "../../../../../common/metamodel/utils";
import BeneficiaryChoice from "@/components/app/data/DataHeader/BeneficiaryChoice";

interface MetaDetailsProps {
  id: string;
}

export default function MetaDetails({ id }: MetaDetailsProps) {
  const { data, loading, error } = useQuery<
    GetMetamodelQuery,
    GetMetamodelVariables
  >(GET_METAMODEL, {
    variables: {
      id,
    },
  });

  const [update_metamodel] = useMutation<
    UpdateMetamodelMutation,
    UpdateMetamodelVariables
  >(UPDATE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODEL,
        variables: {
          id,
        },
      },
    ],
  });

  // Handle model not found error
  if (
    error &&
    "errors" in error &&
    error.errors &&
    error.errors[0] &&
    error.errors[0].extensions?.code === "MODEL_NOT_FOUND"
  ) {
    window.location.href = "/app/data/storage";
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  if (!data) return <div>No data found</div>;

  const file_details = data.getMetamodel;
  const metamodel = data.getMetamodel;
  const parsedData = parseMetamodelMetadata<MetamodelMetadata>(
    metamodel
  );

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

      <div className="flex items-center justify-between gap-2 p-4">
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
                    metadata: stringifyMetamodelMetadata({
                      ...parsedData,
                      title: new_name,
                    }),
                  },
                },
              }).catch((error) => {
                console.error("Failed to update file:", error);
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
        <div className="flex items-center gap-2">
          <BeneficiaryChoice
            metamodel_id={id}
            ignored_beneficiaries={metamodel.ignored_beneficiaries || []}
          />
          <Popup
            trigger={
              <button className="px-2 hover:cursor-pointer">
                <FiMoreHorizontal size={22} />
              </button>
            }
            position="bottom right"
          >
            {/* @ts-ignore */}
            {(close) => {
              return (
                <div className="bg-secondary text-black dark:text-white p-1 border border-default">
                  <ShareMetapod />
                  <button
                    className="p-2 w-full text-left hover:cursor-pointer"
                    onClick={() => {
                      document.getElementById("file-title")?.focus();
                      close();
                    }}
                  >
                    Rename
                  </button>

                  <div className="p-2">
                    <DeleteButton
                      id={data.getMetamodel.id}
                      folder_id={data.getMetamodel.folder_id || "root"}
                    />
                  </div>

                  <div className="p-2 opacity-50 font-semibold">
                    {parsedData.file_ext && (
                      <div className="text-xs">
                        Saved file type is .{parsedData.file_ext}
                      </div>
                    )}
                    <div className="text-xs">
                      Created at:{" "}
                      {getTimeAgo(parseInt(data.getMetamodel.created_at))}
                    </div>
                    <div className="text-xs">
                      Updated at:{" "}
                      {getTimeAgo(parseInt(data.getMetamodel.updated_at))}
                    </div>
                  </div>
                </div>
              );
            }}
          </Popup>
        </div>
      </div>
    </div>
  );
}

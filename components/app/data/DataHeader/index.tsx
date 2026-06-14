"use client";
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import { stringifyMetamodelMetadata } from "@/common/metamodel";
import UPDATE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import {
  GetMetamodelQuery,
  GetMetamodelVariables,
  POD_TYPE,
  UpdateMetamodelMutation,
  UpdateMetamodelVariables,
} from "@/types";
import { useMutation, useQuery } from "@apollo/client/react";
import Options from "./Options";
import BeneficiaryChoice from "./BeneficiaryChoice";
import { CgSandClock } from "react-icons/cg";

export default function DataHeader({
  metamodel_id,
  metamodel_type,
  saveStatus,
  backPath,
}: {
  metamodel_id: string;
  metamodel_type: POD_TYPE;
  saveStatus?: "SAVED" | "NOT_SAVED" | "ERROR" | "LOADING";
  backPath?: string;
}) {
  const { data, loading, error, refetch } = useQuery<
    GetMetamodelQuery,
    GetMetamodelVariables
  >(GET_METAMODEL, {
    variables: {
      id: metamodel_id,
    },
  });

  const [update_metamodel] = useMutation<
    UpdateMetamodelMutation,
    UpdateMetamodelVariables
  >(UPDATE_METAMODEL);

  const model = data?.getMetamodel;
  if (!model) {
    return (
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pt-4 px-4 pb-0 lg:pb-4 bg-secondary animate-pulse gap-3 lg:gap-4 h-[115px] lg:h-[61px]">
        {/* Mobile top bar skeleton */}
        <div className="flex lg:hidden items-center justify-between w-full border-b border-default pb-3 mb-1">
          <div className="flex items-center gap-2">
            {backPath && (
              <div className="pr-1 text-neutral-300 dark:text-neutral-700 flex items-center">
                <IoChevronBack size={24} className="opacity-50" />
              </div>
            )}
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full w-20" />
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full w-8" />
          </div>
        </div>

        {/* Note Title skeleton (Mobile bottom, Desktop left) */}
        <div className="flex gap-2 items-center w-full lg:w-auto">
          <div className="h-8 lg:h-6 bg-neutral-200 dark:bg-neutral-800 rounded-md w-48 lg:w-36" />
          <div className="hidden lg:block h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16" />
        </div>

        {/* Desktop actions skeleton */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full w-24" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full w-8" />
        </div>
      </div>
    );
  }
  const metadata = JSON.parse(model.metadata);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pt-4 px-4 pb-0 lg:pb-4 bg-secondary gap-3 lg:gap-4">
      {/* MOBILE TOP BAR (visible under lg:) */}
      <div className="flex lg:hidden items-center justify-between w-full border-b border-default pb-3 mb-1">
        <div className="flex items-center gap-2">
          {backPath && (
            <Link href={backPath} className="text-forest dark:text-cream hover:text-primary transition-colors flex items-center">
              <IoChevronBack size={24} />
            </Link>
          )}
          {saveStatus && (
            <div className="text-xs font-semibold select-none">
              {saveStatus === "SAVED" ? (
                <span className="text-sage bg-sage/10 px-2 py-0.5 rounded-full">Saved</span>
              ) : saveStatus === "LOADING" ? (
                <span className="text-warning animate-pulse bg-warning/10 px-2 py-0.5 rounded-full">Saving...</span>
              ) : saveStatus === "NOT_SAVED" ? (
                <span className="text-clay bg-clay/10 px-2 py-0.5 rounded-full">Edited</span>
              ) : (
                <span className="text-error bg-error/10 px-2 py-0.5 rounded-full">Error saving</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <BeneficiaryChoice
            metamodel_id={metamodel_id}
            ignored_beneficiaries={model.ignored_beneficiaries || []}
          />
          <Options
            metamodel_id={metamodel_id}
            metamodel_type={metamodel_type}
            created_at={model?.created_at}
            updated_at={model?.updated_at}
          />
        </div>
      </div>

      {/* TITLE & RUNTIME STATUS ROW (Mobile: bottom, Desktop: left side) */}
      <div className="flex gap-2 items-center w-full lg:w-auto border-b lg:border-b-0 border-default pb-3 lg:pb-0">
        <div
          id="name-box"
          className="text-xl font-semibold text-forest dark:text-cream outline-hidden flex-1 lg:flex-initial"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const new_name = e.target.innerText;
            if (new_name.length === 0) {
              const nameElement = document.getElementById("name-box");
              if (nameElement) {
                nameElement.innerText = (model as any).name;
              }
            }
            if (new_name.length > 0 && new_name !== (model as any).name) {
              // backward compatibility for notes and storage which use title instead of name
              const key =
                metamodel_type === "note" || metamodel_type === "storage"
                  ? "title"
                  : "name";
              update_metamodel({
                variables: {
                  data: {
                    id: metamodel_id,
                    metadata: stringifyMetamodelMetadata({
                      ...metadata,
                      [key]: new_name,
                    }),
                  },
                },
              }).then(() => {
                refetch();
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              document.getElementById("name-box")?.blur();
            }
          }}
        >
          {(metadata as any).name || (metadata as any).title || "Untitled"}
        </div>
        
        {/* Desktop-only Save Status (hidden on mobile since it's in the mobile top bar) */}
        {saveStatus && (
          <div className="hidden lg:block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full select-none">
            {saveStatus === "SAVED" ? (
              <span className="text-sage bg-sage/10 px-2 py-0.5 rounded-full">Saved</span>
            ) : saveStatus === "LOADING" ? (
              <span className="text-warning animate-pulse bg-warning/10 px-2 py-0.5 rounded-full">Saving...</span>
            ) : saveStatus === "NOT_SAVED" ? (
              <span className="text-clay bg-clay/10 px-2 py-0.5 rounded-full">Edited</span>
            ) : (
              <span className="text-error bg-error/10 px-2 py-0.5 rounded-full">Error saving</span>
            )}
          </div>
        )}
      </div>

      {/* DESKTOP OPTIONS ROW (hidden on mobile, visible on desktop) */}
      <div className="hidden lg:flex items-center justify-between gap-2">
        <BeneficiaryChoice
          metamodel_id={metamodel_id}
          ignored_beneficiaries={model.ignored_beneficiaries || []}
        />
        <Options
          metamodel_id={metamodel_id}
          metamodel_type={metamodel_type}
          created_at={model?.created_at}
          updated_at={model?.updated_at}
        />
      </div>
    </div>
  );
}

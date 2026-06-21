"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import { GetMetamodelQuery, GetMetamodelVariables } from "@/types";

export interface MetamodelData {
  id: string;
  type: string;
  name: string | null;
  title: string | null;
  folder_id?: string;
  ignored_beneficiaries?: string[];
  created_at: string;
  updated_at: string;
}

export function useMetamodelData(id: string): MetamodelData | null {
  const { data } = useQuery<GetMetamodelQuery, GetMetamodelVariables>(
    GET_METAMODEL,
    { variables: { id } }
  );
  return useMemo(() => {
    const metamodel = data?.getMetamodel;
    if (!metamodel?.metadata) return null;
    let parsed: Record<string, any> | null = null;
    try {
      parsed = JSON.parse(metamodel.metadata);
    } catch {
      return null;
    }
    return {
      id: metamodel.id,
      type: metamodel.type,
      name: parsed?.name || parsed?.title || null,
      title: parsed?.title || parsed?.name || null,
      folder_id: metamodel.folder_id,
      ignored_beneficiaries: metamodel.ignored_beneficiaries,
      created_at: metamodel.created_at,
      updated_at: metamodel.updated_at,
    };
  }, [data]);
}

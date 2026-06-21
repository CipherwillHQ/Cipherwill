// Fetches and parses metamodel metadata (name, type, folder, beneficiaries) from GraphQL.
// Owns: Apollo query + JSON parse. Does NOT own pod-specific data or save logic.
"use client";
import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import GET_METAMODEL from "@/graphql/ops/app/metamodel/queries/GET_METAMODEL";
import { GetMetamodelQuery, GetMetamodelVariables, MetamodelData } from "@/types";

interface MetamodelMetadata {
  name?: string;
  title?: string;
}

export type { MetamodelData };

export function useMetamodelData(id: string): MetamodelData | null {
  const { data } = useQuery<GetMetamodelQuery, GetMetamodelVariables>(
    GET_METAMODEL,
    { variables: { id } }
  );
  return useMemo(() => {
    const metamodel = data?.getMetamodel;
    if (!metamodel?.metadata) return null;
    let parsed: MetamodelMetadata | null = null;
    try {
      parsed = JSON.parse(metamodel.metadata) as MetamodelMetadata;
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

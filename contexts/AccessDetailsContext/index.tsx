"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@apollo/client/react";
import GET_ACCESS_DETAILS from "../../graphql/ops/app/executor/access/queries/GET_ACCESS_DETAILS";
import type { 
  GetAccessDetailsQuery, 
  GetAccessDetailsVariables,
  AccessDetails
} from "@/types/interfaces/metamodel";

interface AccessDetailsContextType {
  accessDetails: AccessDetails | null;
  loading: boolean;
  error: any;
}

const AccessDetailsContext = createContext<AccessDetailsContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  access_id: string;
}

export function AccessDetailsProvider({ children, access_id }: Props) {
  const [accessDetails, setAccessDetails] = useState<AccessDetails | null>(null);

  const { loading, error, data } = useQuery<GetAccessDetailsQuery, GetAccessDetailsVariables>(
    GET_ACCESS_DETAILS, 
    {
      variables: {
        access_id,
      },
      skip: !access_id,
    }
  );

  useEffect(() => {
    if (data?.getAccessDetails) {
      setAccessDetails(data.getAccessDetails);
    }
  }, [data]);

  return (
    <AccessDetailsContext.Provider value={{ accessDetails, loading, error }}>
      {children}
    </AccessDetailsContext.Provider>
  );
}

export function useAccessDetails() {
  const context = useContext(AccessDetailsContext);
  if (context === undefined) {
    throw new Error("useAccessDetails must be used within an AccessDetailsProvider");
  }
  return context;
}
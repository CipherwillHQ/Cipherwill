"use client";
import { useParams } from "next/navigation";
import { AccessDetailsProvider } from "../../../contexts/AccessDetailsContext";

export default function BeneficiaryExecutorLayout({ children }) {
    // get current beneficiary id from access id
    const params = useParams() as { id: string };
    const id = params?.id;
    
    return (
        <AccessDetailsProvider access_id={id}>
            {children}
        </AccessDetailsProvider>
    );
}
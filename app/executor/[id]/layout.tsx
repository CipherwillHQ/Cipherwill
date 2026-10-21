// Provides access context for pages within a shared will.
// Owns the provider boundary and persistent access status.
// Does not render navigation or grant permissions.

"use client";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import ExecutorAccessBoundary from "@/components/executor/ExecutorAccessBoundary";
import { AccessDetailsProvider } from "../../../contexts/AccessDetailsContext";

export default function BeneficiaryExecutorLayout({ children }: { children: ReactNode }) {
    const params = useParams() as { id: string };
    const id = params?.id;
    
    return (
        <AccessDetailsProvider key={id} access_id={id}>
            <ExecutorAccessBoundary>{children}</ExecutorAccessBoundary>
        </AccessDetailsProvider>
    );
}

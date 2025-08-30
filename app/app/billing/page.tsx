"use client";
import { useState } from "react";
import ActiveSubscription from "./ActiveSubscription";
import Invoices from "./Invoices";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
export default function Billing() {
  const [mode, setMode] = useState<"subscription" | "invoices">("subscription");
  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Billing" />
      <div className="px-4">
        <div className="flex gap-3 my-2">
          <button
            className={`cursor-pointer py-1 ${
              mode === "subscription"
                ? "border-b-2 border-accent-500 font-semibold"
                : ""
            }`}
            onClick={() => {
              setMode("subscription");
            }}
          >
            Subscription
          </button>
          <div
            className={`cursor-pointer py-1 ${
              mode === "invoices"
                ? "border-b-2 border-accent-500 font-semibold"
                : ""
            }`}
            onClick={() => {
              setMode("invoices");
            }}
          >
            Invoices
          </div>
        </div>
        {mode === "subscription" && <ActiveSubscription />}
        {mode === "invoices" && <Invoices />}
      </div>
    </div>
  );
}

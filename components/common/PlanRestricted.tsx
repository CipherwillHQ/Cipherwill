"use client";

import { IS_PRODUCTION } from "@/common/constant";
import { useCurrentUserPlan } from "@/contexts/UserSetupContext";

export default function PlanRestricted({
  children,
  placeholder,
  required_plan = "premium",
}: {
  children: React.ReactNode;
  placeholder: React.ReactNode;
  required_plan?: string;
}) {
  if(!IS_PRODUCTION) return children;
  const plan = useCurrentUserPlan();

  if (plan === required_plan) {
    return children;
  }
  return placeholder;
}

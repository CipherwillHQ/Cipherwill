"use client";

import { useEffect } from "react";
import { applyUiPreferences, getUiPreferences } from "@/common/uiPreferences";

export default function AppUiPreferencesBootstrap() {
  useEffect(() => {
    applyUiPreferences(getUiPreferences());
  }, []);

  return null;
}

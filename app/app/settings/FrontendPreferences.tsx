"use client";

import { useState } from "react";
import {
  applyUiPreferences,
  DEFAULT_UI_PREFERENCES,
  getUiPreferences,
  setUiPreferences,
  type UiPreferences,
} from "@/common/uiPreferences";
import Select from "@/components/ui/Select";
import toast from "react-hot-toast";

export default function FrontendPreferences() {
  const [preferences, setPreferences] = useState<UiPreferences>(() =>
    getUiPreferences()
  );

  const updatePreference = <K extends keyof UiPreferences>(
    key: K,
    value: UiPreferences[K]
  ) => {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    setUiPreferences(next);
    applyUiPreferences(next);
  };

  const resetToDefault = () => {
    setPreferences(DEFAULT_UI_PREFERENCES);
    setUiPreferences(DEFAULT_UI_PREFERENCES);
    applyUiPreferences(DEFAULT_UI_PREFERENCES);
    toast.success("Preferences reset to defaults");
  };

  return (
    <div className="border border-default w-full max-w-2xl rounded-md bg-secondary">
      <h2 className="font-semibold border-b border-default p-3">
        Interface Preferences
      </h2>
      <div className="p-3 flex flex-col gap-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          These settings are saved in your browser and applied immediately.
        </p>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Font size</span>
          <Select
            className="text-sm min-w-42.5"
            value={preferences.fontSize}
            onChange={(value) =>
              updatePreference("fontSize", value as UiPreferences["fontSize"])
            }
            options={[
              { label: "Small", value: "small" },
              { label: "Medium", value: "medium" },
              { label: "Large", value: "large" },
            ]}
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Motion</span>
          <Select
            className="text-sm min-w-42.5"
            value={preferences.motion}
            onChange={(value) =>
              updatePreference("motion", value as UiPreferences["motion"])
            }
            options={[
              { label: "Full motion", value: "full" },
              { label: "Reduced motion", value: "reduced" },
            ]}
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Scrolling</span>
          <Select
            className="text-sm min-w-42.5"
            value={preferences.scrollBehavior}
            onChange={(value) =>
              updatePreference(
                "scrollBehavior",
                value as UiPreferences["scrollBehavior"]
              )
            }
            options={[
              { label: "Smooth", value: "smooth" },
              { label: "Instant", value: "instant" },
            ]}
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Content width</span>
          <Select
            className="text-sm min-w-42.5"
            value={preferences.contentWidth}
            onChange={(value) =>
              updatePreference(
                "contentWidth",
                value as UiPreferences["contentWidth"]
              )
            }
            options={[
              { label: "Full width", value: "full" },
              { label: "Reading", value: "reading" },
            ]}
          />
        </label>

        <div className="pt-2">
          <button
            className="hover:cursor-pointer hover:shadow text-sm border border-default px-3 py-1.5 rounded-md hover:bg-white/50 dark:hover:bg-white/10"
            onClick={resetToDefault}
            type="button"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  applyUiPreferences,
  DEFAULT_UI_PREFERENCES,
  getUiPreferences,
  setUiPreferences,
  type UiPreferences,
} from "@/common/uiPreferences";

type Option<T extends string> = {
  label: string;
  value: T;
};

function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium">{label}</span>
      <select
        className="minimal border border-default rounded-md bg-transparent px-3 py-2 text-sm min-w-[170px]"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function FrontendPreferences() {
  const [preferences, setPreferences] = useState<UiPreferences>(
    DEFAULT_UI_PREFERENCES
  );

  useEffect(() => {
    setPreferences(getUiPreferences());
  }, []);

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

        <SelectControl
          label="Font size"
          value={preferences.fontSize}
          onChange={(value) => updatePreference("fontSize", value)}
          options={[
            { label: "Small", value: "small" },
            { label: "Medium", value: "medium" },
            { label: "Large", value: "large" },
          ]}
        />

        <SelectControl
          label="Motion"
          value={preferences.motion}
          onChange={(value) => updatePreference("motion", value)}
          options={[
            { label: "Full motion", value: "full" },
            { label: "Reduced motion", value: "reduced" },
          ]}
        />

        <SelectControl
          label="Scrolling"
          value={preferences.scrollBehavior}
          onChange={(value) => updatePreference("scrollBehavior", value)}
          options={[
            { label: "Smooth", value: "smooth" },
            { label: "Instant", value: "instant" },
          ]}
        />

        <SelectControl
          label="Content width"
          value={preferences.contentWidth}
          onChange={(value) => updatePreference("contentWidth", value)}
          options={[
            { label: "Full width", value: "full" },
            { label: "Reading", value: "reading" },
          ]}
        />

        <div className="pt-2">
          <button
            className="text-sm border border-default px-3 py-1.5 rounded-md hover:bg-white/50 dark:hover:bg-white/10"
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

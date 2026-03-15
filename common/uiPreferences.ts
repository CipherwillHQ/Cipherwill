import { localstorage_get, localstorage_set } from "@/common/localstorage";

export type UiFontSize = "small" | "medium" | "large";
export type UiMotion = "full" | "reduced";
export type UiScrollBehavior = "smooth" | "instant";
export type UiContentWidth = "reading" | "full";

export type UiPreferences = {
  fontSize: UiFontSize;
  motion: UiMotion;
  scrollBehavior: UiScrollBehavior;
  contentWidth: UiContentWidth;
};

const UI_PREFERENCES_KEY = "cw_ui_preferences_v1";

export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  fontSize: "medium",
  motion: "full",
  scrollBehavior: "smooth",
  contentWidth: "full",
};

function parsePreferences(value: string | null): UiPreferences {
  if (!value) return DEFAULT_UI_PREFERENCES;
  try {
    const parsed = JSON.parse(value);
    return {
      fontSize:
        parsed?.fontSize === "small" ||
        parsed?.fontSize === "medium" ||
        parsed?.fontSize === "large"
          ? parsed.fontSize
          : DEFAULT_UI_PREFERENCES.fontSize,
      motion:
        parsed?.motion === "full" || parsed?.motion === "reduced"
          ? parsed.motion
          : DEFAULT_UI_PREFERENCES.motion,
      scrollBehavior:
        parsed?.scrollBehavior === "smooth" ||
        parsed?.scrollBehavior === "instant"
          ? parsed.scrollBehavior
          : DEFAULT_UI_PREFERENCES.scrollBehavior,
      contentWidth:
        parsed?.contentWidth === "reading"
          ? "reading"
          : "full",
    };
  } catch {
    return DEFAULT_UI_PREFERENCES;
  }
}

export function getUiPreferences(): UiPreferences {
  return parsePreferences(localstorage_get(UI_PREFERENCES_KEY));
}

export function setUiPreferences(preferences: UiPreferences) {
  localstorage_set(UI_PREFERENCES_KEY, JSON.stringify(preferences));
}

export function applyUiPreferences(preferences: UiPreferences) {
  if (typeof document === "undefined") return;

  const html = document.documentElement;

  const fontSizeMap: Record<UiFontSize, string> = {
    small: "14px",
    medium: "16px",
    large: "18px",
  };
  html.style.fontSize = fontSizeMap[preferences.fontSize];

  html.classList.toggle("cw-reduced-motion", preferences.motion === "reduced");
  html.style.scrollBehavior =
    preferences.scrollBehavior === "smooth" ? "smooth" : "auto";
  html.setAttribute("data-content-width", preferences.contentWidth);
}

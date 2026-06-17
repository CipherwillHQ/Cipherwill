"use client";

import { DEFAULT_THEME } from "@/common/constant";
import { useContext, useEffect, useState } from "react";
import { IoMdSunny } from "react-icons/io";
import { IoMoon } from "react-icons/io5";
import { createContext } from "react";
import { localstorage_get, localstorage_set } from "@/common/localstorage";

const ThemeContext = createContext({
  current_theme: DEFAULT_THEME,
  resolved_theme: "dark",
  setCurrentTheme: (_theme: string) => {},
});

export function ThemeSelector({ children }: { children: React.ReactNode }) {
  const [current_theme, setCurrentTheme] = useState(
    localstorage_get("theme") || DEFAULT_THEME
  );
  const [resolved_theme, setResolvedTheme] = useState("dark");

  useEffect(() => {
    const applyTheme = (theme: string) => {
      setResolvedTheme(theme);

      const selector = "#app-theme-layout";
      const layout = document.querySelector(selector);
      if (layout) {
        layout.classList.remove("dark", "light");
        layout.classList.add(theme);
      }

      const popup_selector = "#popup-root";
      let popup_root = document.querySelector(popup_selector);
      if (!popup_root) {
        popup_root = document.createElement("div");
        popup_root.setAttribute("id", "popup-root");
        document.body.appendChild(popup_root);
      }
      popup_root.classList.remove("dark", "light");
      popup_root.classList.add(theme);

      let themeMetaTag = document.querySelector('meta[name="theme-color"]');

      if (themeMetaTag === null) {
        themeMetaTag = document.createElement("meta");
        themeMetaTag.setAttribute("name", "theme-color");
        document.head.appendChild(themeMetaTag);
      }

      if (theme === "dark") {
        themeMetaTag.setAttribute("content", "#1f1f1e");
      } else {
        themeMetaTag.setAttribute("content", "#f8f8f6");
      }
    };

    localstorage_set("theme", current_theme);

    if (current_theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
        applyTheme(e.matches ? "dark" : "light");
      };

      // Call once initially
      handleSystemThemeChange(mediaQuery);

      // Listen for system theme changes
      mediaQuery.addEventListener("change", handleSystemThemeChange);

      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    } else {
      applyTheme(current_theme);
    }
  }, [current_theme]);
  const value = { current_theme, resolved_theme, setCurrentTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function SwitchThemeIcon({ size = 20 }: { size?: number }) {
  const { current_theme, resolved_theme, setCurrentTheme } = useTheme();

  const handleToggle = () => {
    if (current_theme === "system") {
      setCurrentTheme("light");
    } else if (current_theme === "light") {
      setCurrentTheme("dark");
    } else {
      setCurrentTheme("system");
    }
  };

  return (
    <div
      className="cursor-pointer mx-2"
      onClick={handleToggle}
    >
      {resolved_theme === "dark" ? (
        <IoMdSunny size={size} />
      ) : (
        <IoMoon size={size} />
      )}
    </div>
  );
}

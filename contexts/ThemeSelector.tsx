"use client";

import { DEFAULT_THEME } from "@/common/constant";
import { useContext, useEffect, useState } from "react";
import { IoMdSunny } from "react-icons/io";
import { IoMoon } from "react-icons/io5";
import { createContext } from "react";

const ThemeContext = createContext({
  current_theme: DEFAULT_THEME,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setCurrentTheme: (_theme: string) => {},
});

export function ThemeSelector({ children }: { children: React.ReactNode }) {
  const [current_theme, setCurrentTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    const selector = "#app-theme-layout";
    document.querySelector(selector)?.classList.remove("dark", "light");
    document.querySelector(selector)?.classList.add(current_theme);

    const popup_selector = "#popup-root";
    let popup_root = document.querySelector(popup_selector);
    if (!popup_root) {
      popup_root = document.createElement("div");
      popup_root.setAttribute("id", "popup-root");
      document.body.appendChild(popup_root);
    }
    popup_root.classList.remove("dark", "light");
    popup_root.classList.add(current_theme);

    let themeMetaTag = document.querySelector('meta[name="theme-color"]');

    if (themeMetaTag === null) {
      themeMetaTag = document.createElement("meta");
      themeMetaTag.setAttribute("name", "theme-color");
      document.head.appendChild(themeMetaTag);
    }

    if (current_theme === "dark") {
      themeMetaTag.setAttribute("content", "#171717");
    } else {
      themeMetaTag.setAttribute("content", "#ffffff");
    }
  }, [current_theme]);
  const value = { current_theme, setCurrentTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function SwitchThemeIcon({ size = 20 }: { size?: number }) {
  const { current_theme, setCurrentTheme } = useTheme();

  return (
    <div
      className="cursor-pointer mx-2"
      onClick={() => setCurrentTheme(current_theme === "dark" ? "light" : "dark")}
    >
      {current_theme === "dark" ? (
        <IoMdSunny size={size} />
      ) : (
        <IoMoon size={size} />
      )}
    </div>
  );
}

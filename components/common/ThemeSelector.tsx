"use client";

import themeAtom from "@/state/common/themeAtom";
import { useEffect, useState } from "react";
import { IoMdSunny } from "react-icons/io";
import { IoMoon } from "react-icons/io5";
import { useRecoilState, useRecoilValue } from "recoil";

export function ThemeSelector({ children }: { children: React.ReactNode }) {
  const current_theme = useRecoilValue(themeAtom);
  useEffect(() => {
    const selector = "#app-theme-layout";
    document.querySelector(selector)?.classList.remove("dark", "light");
    document.querySelector(selector)?.classList.add(current_theme);

    const popup_selector = "#popup-root";
    let popup_root = document.querySelector(popup_selector);
    if(!popup_root){
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

  return children;
}

export function SwitchThemeIcon({ size = 20 }: { size?: number }) {
  const [currentTheme, setCurrentTheme] = useRecoilState(themeAtom);
  const [final_state, set_final_state] = useState("light");
  useEffect(() => {
    set_final_state(currentTheme);
  }, [currentTheme]);

  return (
    <div
      className="cursor-pointer mx-2"
      onClick={() => setCurrentTheme(final_state === "dark" ? "light" : "dark")}
    >
      {final_state === "dark" ? (
        <IoMdSunny size={size} />
      ) : (
        <IoMoon size={size} />
      )}
    </div>
  );
}

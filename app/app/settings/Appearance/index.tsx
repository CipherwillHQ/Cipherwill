"use client";

import { useTheme } from "@/contexts/ThemeSelector";
import { BsCircle, BsCircleFill } from "react-icons/bs";
import dark from "./dark.svg";
import light from "./light.svg";
import Image from "next/image";

export default function Appearance() {
  const { current_theme, setCurrentTheme } = useTheme();
  return (
    <div className="border border-default w-full max-w-2xl rounded-md bg-secondary">
      <h2 className="font-semibold border-b border-default p-3">Appearance</h2>
      <div className="p-3">
        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
          We will use your selected theme for Cipherwill platform.
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
          <button
            className={`p-2 border rounded-md
                ${
                  current_theme === "dark"
                    ? "font-semibold border-white"
                    : "border-default"
                }
                `}
            onClick={() => setCurrentTheme("dark")}
          >
            <Image src={dark} alt="Dark Theme" />
            <div className="flex items-center gap-1 pt-2 text-sm">
              {current_theme === "dark" ? <BsCircleFill /> : <BsCircle />}
              <span>Dark</span>
            </div>
          </button>
          <button
            className={`p-2 border border-default rounded-md
            ${current_theme === "light" && "font-semibold border-black"}
            `}
            onClick={() => setCurrentTheme("light")}
          >
            <Image src={light} alt="Light Theme" />
            <div className="flex items-center gap-1 pt-2 text-sm">
              {current_theme === "light" ? <BsCircleFill /> : <BsCircle />}
              <span>Light</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

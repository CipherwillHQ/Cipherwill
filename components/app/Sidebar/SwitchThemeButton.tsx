import themeAtom from "@/state/common/themeAtom";
import { TbMoon, TbSun } from "react-icons/tb";
import { useRecoilState } from "recoil";
import SidebarItem from "./SidebarItem";

export default function SwitchThemeButton() {
  const [currentTheme, setCurrentTheme] = useRecoilState(themeAtom);

  return (
    <div
      data-cy="switch-theme-btn"
      onClick={() => {
        setCurrentTheme(currentTheme === "dark" ? "light" : "dark");
      }}
      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
    >
      <button className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700">
        <div className={`mr-2 text-xl`}>
          {currentTheme === "dark" ? <TbSun /> : <TbMoon />}
        </div>
        <div className={`font-medium text-sm`}>
          {currentTheme === "dark" ? "Switch to Light" : "Switch to Dark"}
        </div>
      </button>
    </div>
  );
}

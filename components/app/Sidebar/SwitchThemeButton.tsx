import { useAuth } from "@/contexts/AuthContext";
import { TbMoon, TbSun } from "react-icons/tb";

export default function SwitchThemeButton() {
    const {current_theme, setCurrentTheme} = useAuth();

  return (
    <div
      data-cy="switch-theme-btn"
      onClick={() => {
        setCurrentTheme(current_theme === "dark" ? "light" : "dark");
      }}
      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
    >
      <button className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700">
        <div className={`mr-2 text-xl`}>
          {current_theme === "dark" ? <TbSun /> : <TbMoon />}
        </div>
        <div className={`font-medium text-sm`}>
          {current_theme === "dark" ? "Switch to Light" : "Switch to Dark"}
        </div>
      </button>
    </div>
  );
}

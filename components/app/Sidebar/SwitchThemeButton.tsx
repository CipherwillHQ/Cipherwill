// Renders the shared theme control for dashboard sidebars.
// Owns cycling between system, light, and dark appearances.
// Does not persist themes directly or render navigation.

import { useTheme } from "@/contexts/ThemeSelector";
import { TbMoon, TbSun, TbDeviceLaptop } from "react-icons/tb";

const getNextTheme = (theme: string) => {
  if (theme === "system") return "light";
  if (theme === "light") return "dark";
  return "system";
};

export default function SwitchThemeButton({ compactOnMobile = false }: { compactOnMobile?: boolean }) {
  const { current_theme, setCurrentTheme } = useTheme();
  const nextTheme = getNextTheme(current_theme);

  const getThemeLabelAndIcon = (theme: string) => {
    switch (theme) {
      case "light":
        return { label: "Switch to Light", icon: <TbSun /> };
      case "dark":
        return { label: "Switch to Dark", icon: <TbMoon /> };
      case "system":
      default:
        return { label: "Switch to System", icon: <TbDeviceLaptop /> };
    }
  };

  const { label, icon } = getThemeLabelAndIcon(nextTheme);

  return (
    <div
      data-cy="switch-theme-btn"
      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md w-full cursor-pointer"
    >
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => setCurrentTheme(nextTheme)}
        className={"flex min-h-11 items-center rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " + (compactOnMobile ? "justify-center sm:justify-start" : "justify-start")}
      >
        <div className={compactOnMobile ? "text-xl sm:mr-2" : "mr-2 text-xl"}>
          {icon}
        </div>
        <div className={compactOnMobile ? "hidden font-medium text-sm sm:block" : "font-medium text-sm"}>
          {label}
        </div>
      </button>
    </div>
  );
}

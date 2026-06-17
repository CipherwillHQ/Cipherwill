import { useTheme } from "@/contexts/ThemeSelector";
import { TbMoon, TbSun, TbDeviceLaptop } from "react-icons/tb";

const getNextTheme = (theme: string) => {
  if (theme === "system") return "light";
  if (theme === "light") return "dark";
  return "system";
};

export default function SwitchThemeButton() {
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
      onClick={() => {
        setCurrentTheme(nextTheme);
      }}
      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md w-full cursor-pointer"
    >
      <button className="flex items-center p-2 rounded-md justify-start hover:bg-neutral-100 dark:hover:bg-neutral-700 w-full">
        <div className={`mr-2 text-xl`}>
          {icon}
        </div>
        <div className={`font-medium text-sm`}>
          {label}
        </div>
      </button>
    </div>
  );
}

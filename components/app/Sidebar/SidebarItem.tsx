import { JSX } from "react";

export default function SidebarItem({
  icon,
  title,
  trailing_element,
}: {
  icon: JSX.Element;
  title: string;
  trailing_element?: JSX.Element;
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md cursor-pointer">
      <div className="flex items-center">
        <div className={`mr-2 text-xl sm:text-lg`}>{icon}</div>
        <div className={`text-base sm:text-sm font-medium`}>{title}</div>
      </div>
      <div>{trailing_element}</div>
    </div>
  );
}

import SidebarLogo from "./SidebarLogo";
import SidebarPanel from "./SidebarPanel";

export default function Sidebar() {
  return (
    <div className="hidden sm:flex flex-col h-screen w-60 p-2 border-r border-default">
      <SidebarLogo />
      <SidebarPanel />
    </div>
  );
}

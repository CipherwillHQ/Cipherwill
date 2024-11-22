import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import MobileMenu from "@/components/app/Sidebar/MobileMenu";
import Link from "next/link";
import menu from "@/components/app/Sidebar/menu";

function get_filtered_menu(menu) {
  let start_return = false;
  return menu.filter((item, index) => {
    if (item.divider === "Platform") {
      start_return = true;
      return false;
    }
    if (start_return) {
      return true;
    }else{
      return false;
    }
  })
}

export default function Platform() {
  // get menu after data dividor and before network divider
  const filtered_menu  = get_filtered_menu(menu);
  return (
    <div className="w-full">
      <MobileMenu/>
      <DesktopAndMobilePageHeader title="Platform" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 py-4 px-4">
        {filtered_menu.map((item, index) => {
          if (item.divider) {
            return (
              <div
                key={index}
                className=""
              >
                <div className="text-black/80 dark:text-white">{item.divider}</div>
              </div>
            );
          }
          return (
            <div key={index} className="border border-default p-2 rounded-md bg-secondary">
              <Link
                href={item.path}
                className="flex items-center gap-2"
              >
                {item.icon}
                {item.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

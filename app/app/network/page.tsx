import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import MobileMenu from "@/components/app/Sidebar/MobileMenu";
import Link from "next/link";
import menu from "@/components/app/Sidebar/menu";

function get_filtered_menu(menu) {
  let start_return = false;
  return menu.filter((item, index) => {
    if (item.divider === "Network") {
      start_return = true;
      return false;
    }
    if (item.divider === "Platform") {
      start_return = false;
      return false;
    }
    if (start_return) {
      return true;
    }else{
      return false;
    }
  })
}

export default function Network() {
  // get menu after data dividor and before network divider
  const filtered_menu  = get_filtered_menu(menu);
  return (
    <div className="w-full">
      <MobileMenu/>
      <DesktopAndMobilePageHeader title="Network" />
      <div className="py-4 px-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered_menu.map((item, index) => {
            if (item.divider) {
              return (
                <div
                  key={index}
                  className="col-span-2 sm:col-span-3 md:col-span-4 pt-2"
                >
                  <div className="text-black/80 dark:text-white font-medium">{item.divider}</div>
                </div>
              );
            }
            return (
              <Link
                key={index}
                href={item.path}
                className="border border-default rounded-lg bg-secondary hover:bg-secondary/80 transition-colors w-full h-32 flex flex-col items-center justify-center gap-2 p-4 text-center"
              >
                <div className="text-2xl">
                  {item.icon}
                </div>
                <div className="text-sm font-medium line-clamp-2">
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

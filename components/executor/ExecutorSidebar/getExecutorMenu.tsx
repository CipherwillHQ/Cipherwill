// Builds the executor sidebar from the existing data categories.
// Owns overview routes and category links for the current will.
// Does not fetch donor details or filter granted data.

import { TbFileDescription, TbLayoutDashboard } from "react-icons/tb";
import { executorSegments } from "@/common/executor/segments";
import type { ExecutorMenuItem } from "@/types/interfaces";
import type { Divider } from "@/types/Segments";

export default function getExecutorMenu(pathname: string): (ExecutorMenuItem | Divider)[] {
  const accessId = pathname.split("/")[2];
  const menu: (ExecutorMenuItem | Divider)[] = [
    { icon: <TbLayoutDashboard />, title: "Shared wills", path: "/executor" },
  ];

  if (accessId) {
    menu.push(
      { icon: <TbFileDescription />, title: "Will overview", path: "/executor/" + accessId },
      ...executorSegments.map((segment) =>
        "divider" in segment
          ? segment
          : { icon: segment.icon, title: segment.title, path: "/executor/" + accessId + "/" + segment.slug },
      ),
    );
  }
  return menu;
}

// Builds the executor sidebar from populated shared categories.
// Owns overview routes and available category links for the current will.
// Does not fetch donor details or calculate beneficiary permissions.

import { TbFileDescription, TbLayoutDashboard } from "react-icons/tb";
import type { ExecutorMenuItem } from "@/types/interfaces";
import type { Divider, Segment } from "@/types/Segments";

export default function getExecutorMenu(pathname: string, segments: (Divider | Segment)[]): (ExecutorMenuItem | Divider)[] {
  const accessId = pathname.split("/")[2];
  const menu: (ExecutorMenuItem | Divider)[] = [
    { icon: <TbLayoutDashboard />, title: "Shared wills", path: "/executor" },
  ];

  if (accessId) {
    menu.push(
      { icon: <TbFileDescription />, title: "Will overview", path: "/executor/" + accessId },
      ...segments.map((segment) =>
        "divider" in segment
          ? segment
          : { icon: segment.icon, title: segment.title, path: "/executor/" + accessId + "/" + segment.slug },
      ),
    );
  }
  return menu;
}

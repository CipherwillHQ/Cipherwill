import segments from "@/app/app/segments/segments";
import { Segment } from "@/types/Segments";
import { AiOutlineHome } from "react-icons/ai";
import { TbApiApp, TbHomeShield, TbNotes, TbSignLeft } from "react-icons/tb";

function getExecutorMenu(pathname: string) {
  const exeutorId = pathname.split("/")[2];
  const menu: any = [
    {
      icon: <AiOutlineHome />,
      title: "Home",
      path: `/executor`,
    },
  ];

  if (exeutorId) {
    menu.push({
      donor: true,
    });
  
    segments.forEach((segment) => {
      if ('divider' in segment && segment.divider) {
        menu.push({
          divider: true,
        });
        return;
      }
      menu.push({
        icon: (segment as Segment).icon,
        title: (segment as Segment).title,
        path: `/executor/${exeutorId}/${(segment as Segment).slug}`,
      });
    });
  }
  return menu;
}

export default getExecutorMenu;

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
    
    menu.push({
      icon: <TbNotes />,
      title: "Bank Accounts",
      path: `/executor/${exeutorId}/bank-accounts`,
    });
    menu.push({
      icon: <TbNotes />,
      title: "Notes",
      path: `/executor/${exeutorId}/notes`,
    });
  }
  menu.push({
    divider: true,
  });
  menu.push({
    icon: <TbHomeShield />,
    title: "Back to Cipherwill App",
    path: `/app`,
  });
  return menu;
}

export default getExecutorMenu;

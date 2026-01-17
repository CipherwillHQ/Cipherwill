import { AiOutlineHome } from "react-icons/ai";
import {
  TbCell,
  TbClockPlay,
  TbFileInvoice,
  TbLockAccess,
  TbTableSpark,
} from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import { BiUserPlus } from "react-icons/bi";
import { TiDownloadOutline } from "react-icons/ti";
import { BsFilePerson } from "react-icons/bs";
import segments from "@/app/app/segments/segments";
import { Divider, Segment } from "@/types/Segments";
import { RiNotificationBadgeLine } from "react-icons/ri";
import { MdTaskAlt } from "react-icons/md";

const menu: (Divider | Segment)[] = [
  {
    icon: <AiOutlineHome />,
    title: "Home",
    description: "Dashboard of cipherwill",
    plan_required: "free",
    preference_key: null,
    path: "/app",
  },
  {
    icon: <MdTaskAlt />,
    title: "Score",
    description: "Cipherwill Score",
    plan_required: "free",
    preference_key: null,
    path: "/app/score",
  },
  {
    icon: <TbCell />,
    title: "Segments",
    description: "Segment management",
    plan_required: "free",
    preference_key: null,
    path: "/app/segments",
  },
  {
    icon: <RiNotificationBadgeLine />,
    title: "Notifications",
    description: "Notification management",
    plan_required: "free",
    preference_key: null,
    path: "/app/notifications",
  },
  // {
  //   icon: <IoIosAnalytics />,
  //   title: "Usage",
  //   path: "/app/usage",
  // },
  ...(segments as any),
  {
    divider: "Network",
    path: "/app/network",
  },
  {
    icon: <BiUserPlus />,
    title: "Beneficiaries",
    path: "/app/beneficiaries",
  },
  {
    icon: <BsFilePerson />,
    title: "Friends & Family",
    path: "/app/friends",
  },
  {
    divider: "Platform",
    path: "/app/platform",
  },
  {
    icon: <TbClockPlay />,
    title: "Timeline",
    path: "/app/timeline",
  },
  {
    icon: <TbFileInvoice />,
    title: "Billing",
    path: "/app/billing",
  },
  {
    icon: <TbLockAccess />,
    title: "Security Factors",
    path: "/app/factors",
  },
  {
    icon: <VscSettings />,
    title: "Settings",
    path: "/app/settings",
  },
];

export default menu;

import { JSX } from "react";
import { BiFolder } from "react-icons/bi";
import { GiMoneyStack } from "react-icons/gi";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { MdAlternateEmail } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import { RiArchiveStackLine } from "react-icons/ri";
import { TbDevices, TbNotes } from "react-icons/tb";
import { VscWholeWord } from "react-icons/vsc";

const segment_icons: {
  slug: string;
  icon: JSX.Element;
}[] = [
  {
    icon: <TbNotes />,
    slug: "notes",
  },
  {
    icon: <MdAlternateEmail />,
    slug: "email-accounts",
  },
  {
    icon: <TbDevices />,
    slug: "device-locks",
  },

  {
    icon: <PiPassword />,
    slug: "passwords",
  },

  {
    icon: <VscWholeWord />,
    slug: "seed-phrases",
  },

  {
    icon: <RiArchiveStackLine />,
    slug: "defi-staking",
  },

  {
    icon: <GiMoneyStack />,
    slug: "bank-accounts",
  },

  {
    icon: <HiOutlineCreditCard />,
    slug: "payment-cards",
  },

  {
    icon: <BiFolder />,
    slug: "storage",
  },
];
export default segment_icons;

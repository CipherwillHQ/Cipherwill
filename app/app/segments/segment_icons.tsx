/**
 * Segment Icons
 * What it does: Defines and exports the default Tabler-based visual icons mapped to each segment slug.
 * What it owns: Standardized react-icons JSX mappings for dashboard categories.
 * What it does NOT do: Does not define custom elements, only wraps react-icons.
 */

import { JSX } from "react";
import {
  TbNotes,
  TbMail,
  TbDevices,
  TbKey,
  TbShieldLock,
  TbCoins,
  TbBuildingBank,
  TbCreditCard,
  TbFolder,
} from "react-icons/tb";

const segment_icons: {
  slug: string;
  icon: JSX.Element;
}[] = [
  {
    icon: <TbNotes />,
    slug: "notes",
  },
  {
    icon: <TbMail />,
    slug: "email-accounts",
  },
  {
    icon: <TbDevices />,
    slug: "device-locks",
  },
  {
    icon: <TbKey />,
    slug: "passwords",
  },
  {
    icon: <TbShieldLock />,
    slug: "seed-phrases",
  },
  {
    icon: <TbCoins />,
    slug: "defi-staking",
  },
  {
    icon: <TbBuildingBank />,
    slug: "bank-accounts",
  },
  {
    icon: <TbCreditCard />,
    slug: "payment-cards",
  },
  {
    icon: <TbFolder />,
    slug: "storage",
  },
];

export default segment_icons;

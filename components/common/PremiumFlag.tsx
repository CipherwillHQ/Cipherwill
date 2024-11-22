"use client";
import capitalizeFirstLetter from "@/common/string/capitalizeFirstLetter";
import getLocalCountry from "../../common/country/getLocalCountry";
import { useUserContext } from "../../contexts/UserSetupContext";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import Link from "next/link";
import { LuBadgeCheck } from "react-icons/lu";
import getCountryNameByCode from "@/common/country/getCountryNameByCode";
import SidebarItem from "../app/Sidebar/SidebarItem";

export default function PremiumFlag() {
  const { user } = useUserContext();
  const country = user?.country || getLocalCountry();
  const user_plan = user && user?.plan;
  // "premium";
  // "free";
  return (
    <Link href={`/app/billing`}>
      {user_plan !== "free" ? (
        <SidebarItem
          icon={<LuBadgeCheck className="text-yellow-600" />}
          title={`${capitalizeFirstLetter(
            user_plan
          )} Plan (${getCountryNameByCode(country)})`}
        />
      ) : (
        <SidebarItem icon={<FaRegArrowAltCircleUp />} title="Upgrade plan" />
      )}
    </Link>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import nameBlack from "../../../assets/name-black.png";
import nameWhite from "../../../assets/name-white.png";
import { useUserContext } from "@/contexts/UserSetupContext";
import getLocalCountry from "@/common/country/getLocalCountry";

export default function SidebarLogo() {
  const { user } = useUserContext();
  const country = user?.country || getLocalCountry();
  return (
    <Link href="/app">
      {/* <Image
              width={150}
              height={100}
              alt="cipherwill logo"
              className="py-1 hidden dark:block"
              src={nameWhite}
            /> */}

{/* user && user.plan !== "free" ? (
          <>
            <Image
              width={135}
              height={80}
              alt="cipherwill premium logo"
              className="py-1 dark:hidden"
              src={premiumBlack}
            />
            <Image
              width={135}
              height={80}
              alt="cipherwill premium  logo"
              className="py-1 hidden dark:block"
              src={premiumWhite}
            />
          </>
        ) :  */}
      <div className="py-3 px-1 flex items-end">
        {(
          <>
            <Image
              width={150}
              height={100}
              alt="cipherwill logo"
              className="py-1 dark:hidden"
              src={nameBlack}
            />
            <Image
              width={150}
              height={100}
              alt="cipherwill logo"
              className="py-1 hidden dark:block"
              src={nameWhite}
            />
          </>
        )}
        
      </div>
    </Link>
  );
}

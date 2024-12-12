import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlack from "../../assets/name-black.png";
import logoWhite from "../../assets/name-white.png";
import LoginSection from "./LoginSection";
import { FULL_HOSTNAME } from "@/common/constant";

const title = "Log in • Cipherwill";
const description =
  "New to Cipherwill or already have an account? Create your account here or sign in to manage your digital assets securely.";

export const metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images: ["/og-img.png"],
    url: `${FULL_HOSTNAME}/auth`,
  },
};

export default function Login({ params }) {
  return (
    <div className="flex flex-col w-full items-center justify-between h-screen overflow-hidden">
      <div className="flex w-full h-full">
        <div className="hidden md:flex flex-col justify-between flex-1 dark:bg-gradient-to-r from-[#0E0E0E] via-[#1A1A1A] to-[#0E0E0E] bg-slate-100">
          <LogoHeader />
          <div className="text-3xl font-bold pb-6 text-center">
            Your Digital Will
          </div>
          <div />
        </div>

        <div className="flex flex-col flex-1 justify-between">
          <div className="flex w-full justify-between md:justify-end">
            <div className="md:hidden">
              <LogoHeader />
            </div>
            <div className="pt-4 pr-2">{/* <SwitchThemeIcon /> */}</div>
          </div>
          <div>
            {/* h1 for seo */}
            <h1 className="hidden text-xl font-bold pb-6 text-center">
              Log in to your Cipherwill account or create a new one
            </h1>
            <Suspense
              fallback={
                <div className="text-center p-2">Authentication Loading...</div>
              }
            >
              <LoginSection />
            </Suspense>
          </div>
          {/* <Footer /> */}
          {/* empty div to make flex works */}
          <div></div>
        </div>
      </div>
    </div>
  );
}

function LogoHeader() {
  return (
    <div className="flex items-center justify-between w-full px-3 py-4">
      <div>
        <Link href="/">
          <Image
            alt="cipherwill logo"
            src={logoBlack}
            width={150}
            height={150}
            className="block dark:hidden"
          />
          <Image
            alt="cipherwill logo"
            src={logoWhite}
            width={150}
            height={150}
            className="hidden dark:block"
          />
        </Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="text-xs p-2 font-light text-center text-neutral-500">
      when you continue with cipherwill you accept the
      <Link
        href={"/i/terms-of-service"}
        className="text-blue-800 font-medium mx-1"
      >
        terms of service
      </Link>
      and
      <Link
        href={"/i/privacy-policy"}
        className="text-blue-800 font-medium mx-1"
      >
        privacy policy
      </Link>
    </div>
  );
}

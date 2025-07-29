import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBlack from "../../assets/logo-black.png";
import LoginSection from "./LoginSection";
import { FULL_HOSTNAME } from "@/common/constant";
import { BiCheckCircle } from "react-icons/bi";
import bg from "./bg.webp";

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
    <div
      className="flex items-start w-full h-screen p-8 gap-8 overflow-hidden"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex flex-col justify-evenly flex-1 gap-8 w-full h-full overflow-auto customScrollbar">
        <div className="py-8 bg-white w-full max-w-lg mx-auto p-8 rounded-3xl">
          <LogoHeader />
          <Suspense
            fallback={
              <div className="py-6 max-w-md w-full mx-auto animate-pulse">
                Loading Authentication...
              </div>
            }
          >
            <LoginSection />
          </Suspense>
        </div>
      </div>
      <div className="hidden md:flex flex-col justify-center items-center flex-1 h-full">
        <div className="flex flex-col justify-center w-full h-full rounded-xl p-8">
          <div className="flex flex-col gap-8 text-white">
            <h2 className="text-4xl font-semibold">
              Built on Trust. Backed by Thousands. <br />
              Designed with Security in Mind.
            </h2>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 font-semibold">
              <div className="flex items-center gap-1 whitespace-nowrap">
                <BiCheckCircle className="text-xl" />
                End-to-End Encrypted
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <BiCheckCircle className="text-xl" />
                Peace of Mind
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <BiCheckCircle className="text-xl" />
                Start with $0
              </div>
            </div>
          </div>
        </div>
        <div />
      </div>
    </div>
  );
}

function LogoHeader() {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      <Link href="/">
        <Image alt="cipherwill logo" src={logoBlack} width={35} height={35} />
      </Link>
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

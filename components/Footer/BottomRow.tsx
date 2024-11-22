import Link from "next/link";
import { BiLogoGithub, BiLogoYoutube, BiSupport, BiX } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

export default function BottomRow() {
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between pb-6">
      <div
        className={`flex flex-col sm:flex-row gap-3 sm:gap-2 items-start text-sm font-playfair`}
      >
        <div className="text-center">
          Copyright © {new Date().getFullYear()} Zetapad Technologies
        </div>
        <div className="hidden sm:flex border-l border-white/25 h-4" />
        <Link href="/i/privacy-policy" className="text-center">
          Privacy Policy
        </Link>
        <div className="hidden sm:flex border-l border-white/25  h-4" />
        <Link href="/i/terms-of-service" className="text-center">
          Terms of Service
        </Link>
        <div className="hidden sm:flex border-l border-white/25  h-4" />
        <Link
          target="_blank"
          href="https://github.com/CipherwillHQ/Cipherwill"
          className="text-center"
        >
          Open Source Client
        </Link>
      </div>
      <ul className="flex items-center mt-5 space-x-3 md:order-3 sm:mt-0">
        <li>
          <Link
            href="mailto:support@cipherwill.com"
            target="_blank"
            className="flex items-center justify-center border border-white/25 rounded-full w-7 h-7"
          >
            <BiSupport />
          </Link>
        </li>
        <li>
          <Link
            href="https://x.com/CipherwillHQ"
            target="_blank"
            className="flex items-center justify-center border border-white/25 rounded-full w-7 h-7"
          >
            <FaXTwitter />
          </Link>
        </li>
        <li>
          <Link
            href="https://www.youtube.com/@CipherwillHQ"
            target="_blank"
            className="flex items-center justify-center text-red-600 border border-white/25 rounded-full w-7 h-7"
          >
            <BiLogoYoutube />
          </Link>
        </li>

        <li>
          <Link
            href="https://github.com/CipherwillHQ/Cipherwill"
            target="_blank"
            className="flex items-center justify-center text-white border border-white/25 rounded-full w-7 h-7"
          >
            <BiLogoGithub />
          </Link>
        </li>
      </ul>
    </div>
  );
}

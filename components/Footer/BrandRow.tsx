import Link from "next/link";
import SymbolicLogo from "../public/logo/SymbolicLogo";
import LinkToTheTop from "../public/LinkToTheTop";

export default function BrandRow() {
  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <Link href="/" className="inline-flex">
        <SymbolicLogo size={38} overrideTheme="dark" />
      </Link>
      <LinkToTheTop
        href="/app"
        className="inline-flex items-center justify-center bg-cream text-mahogany text-base font-semibold px-6 py-3 rounded-full hover:bg-cream/90 hover:shadow-sm transition-all duration-200"
      >
        Get Started
      </LinkToTheTop>
    </div>
  );
}

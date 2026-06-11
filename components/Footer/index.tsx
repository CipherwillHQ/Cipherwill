import HeroBanner from "./HeroBanner";
import BrandRow from "./BrandRow";
import LinkColumns from "./LinkColumns";
import SocialRow from "./SocialRow";
import BottomRow from "./BottomRow";

export default function Footer() {
  return (
    <div className="w-full bg-mahogany text-cream">
      <footer className="px-4 py-12 sm:py-16 max-w-6xl mx-auto flex flex-col gap-10 sm:gap-12">
        <HeroBanner />
        <BrandRow />
        <LinkColumns />
        <hr className="border-cream/10" />
        <div className="flex flex-col gap-6">
          <SocialRow />
          <BottomRow />
        </div>
      </footer>
    </div>
  );
}

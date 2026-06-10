/**
 * HeroBanner component renders the call-to-action hero banner in the footer.
 * It owns the hero banner background image and title.
 * It does NOT handle any other sections of the footer.
 */
import Image from "next/image";
import bannerImage from "./sunset-golder-hour-cipherwill.webp";

export default function HeroBanner() {
  return (
    <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] rounded-2xl overflow-hidden">
      <Image
        src={bannerImage}
        alt="Protect your legacy"
        fill
        className="object-cover animate-subtle-pan-zoom"
        sizes="(max-width: 1280px) 100vw, 1280px"
      />
      <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-12 text-center">
        <h2 className="text-5xl sm:text-6xl md:text-7xl text-mahogany font-playfair font-bold italic leading-tight">
          Your estate. Your succession. Fully covered.
        </h2>
      </div>
    </div>
  );
}

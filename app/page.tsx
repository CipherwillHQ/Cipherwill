import Header from "../components/Header";
import { Metadata } from "next";
import { FULL_HOSTNAME } from "@/common/constant";
import CenterHero from "@/components/public/Hero/CenterHero";
import DeadManSwitchExplainer from "@/components/public/DeadManSwitchExplainer";
import WhyYouNeedCipherwill from "@/components/public/landing/WhyYouNeedCipherwill";
import WhatIsCipherwill from "@/components/public/landing/WhatIsCipherwill";
import WhyChooseCipherwill from "@/components/public/landing/WhyChooseCipherwill";
import FAQs from "@/components/public/FAQs";
import CTA from "@/components/public/CTA";
import Footer from "@/components/Footer";

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const { og_img } = await searchParams;
  let cover = "/og-img.png";
  if (og_img && og_img.startsWith("https://media.cipherwill.com")) {
    cover = og_img;
  }
  return {
    openGraph: {
      images: [cover],
      url: `${FULL_HOSTNAME}/`,
    },
  };
}

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <CenterHero />
      {/* <div className="bg-red-400 my-12 py-8">
        <h2 className="text-xl font-bold text-center py-8">
          Cipherwill supports multiple encryption methods
        </h2>
        <div className="flex items-center gap-2 justify-evenly">
          <div>Master Password</div>
          <div>Metamask</div>
          <div>Ledger Device</div>
          <div>Trezor Device</div>
          <div>FIDO U2F Keys</div>
          <div>Yubikeys</div>
        </div>
      </div> */}
      {/* <ScreenshotDemo/> -------------------*/}
      <DeadManSwitchExplainer />
      {/* <StatsOfBenefit/> -------------------*/}
      <WhyYouNeedCipherwill />
      <WhatIsCipherwill />
      <WhyChooseCipherwill />
      <FAQs />
      <CTA />
      <Footer />
    </div>
  );
}

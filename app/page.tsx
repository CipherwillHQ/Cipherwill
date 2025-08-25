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
import BoxHero from "@/components/landing/BoxHero";
import StatsOfBenefit from "@/components/public/landing/StatsOfBenefit";
import RatingsAndUsers from "@/components/landing/RatingsAndUsers";
import ScreenshotDemo from "@/components/public/landing/ScreenshotDemo";
import FactorsListView from "@/components/landing/FactorsListView";
import SmoothPageScroll from "@/components/animated/SmoothPageScroll";
import CipherwillIntroScroller from "@/components/public/landing/CipherwillIntroScroller";
import CipherwillIntroBox from "@/components/public/landing/CipherwillIntroBox";
import AsSeenIn from "@/components/landing/AsSeenIn";

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
      <SmoothPageScroll/>
      <Header />
      <BoxHero />
      <RatingsAndUsers/>
      <AsSeenIn/>
      <FactorsListView/>
      {/* <CenterHero /> */}
      {/* <ScreenshotDemo/>  */}
      {/* <DeadManSwitchExplainer /> */}
      {/* <StatsOfBenefit/> */}
      <WhyYouNeedCipherwill />
      {/* <WhatIsCipherwill /> */}
      <CipherwillIntroBox/>
      <CipherwillIntroScroller/>
      <WhyChooseCipherwill />
      <FAQs />
      <CTA />
      <Footer />
    </div>
  );
}

"use client";
import Link from "next/link";
import TaglineABTest from "./TaglineABTest";
import SimpleButton from "@/components/common/SimpleButton";
import { BiRightArrowAlt } from "react-icons/bi";
import { TbLock } from "react-icons/tb";
import InfoButton from "@/components/common/InfoButton";

export default function CenterHero() {
  return (
    <>
      <section
        className="relative text-black pt-40 pb-32 px-2"
        // style={{
        //   backgroundImage: `url('${herograd.src}')`,
        //   // backgroundImage: `url('https://i.pinimg.com/originals/19/a1/b2/19a1b216f31a5d18a054aef242ccacab.jpg')`,
        //   backgroundRepeat: "no-repeat",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
      >
        {/* <div
          className="absolute top-0 left-0 h-1/3 w-1/4 overflow-hidden blur-2xl"
          style={{
            background:
              "radial-gradient(circle farthest-side at top left, rgba(222,229,114,1) 20%, rgba(251,217,141,1) 51%, rgba(255,232,212,0.4906337535014006) 100%)",
          }}
        >
          uppper right
        </div>
        <div
          className="absolute bottom-0 right-0 h-1/3 w-1/4 overflow-hidden blur-2xl -z-10"
          style={{
            background:
              "radial-gradient(circle farthest-side at bottom right, rgba(35,214,212,1) 25%, rgba(135,240,198,1) 51%, rgba(233,106,193,0.25) 100%)",
          }}
        >
          lower bottom
        </div> */}
        <div className="flex flex-col items-center mx-auto max-w-7xl w-full py-4">
          {/* <InfoButton
            icon={<TbLock />}
            triggerClassName="border-lime-500 text-lime-700 bg-lime-50 font-semibold text-sm mb-8"
            triggerTitle="Your data never leaves your device"
            title="Your data never leaves your device"
            description="We make sure everything is encrypted on device before it leaves your device. We never have access to your data."
            allowed_positions={"bottom center"}
          /> */}
          <div className="border bg-gray-100 rounded-full py-1 px-8 font-semibold mb-12 text-center">
            Cipherwill is Open Source & Supports End-to-End Encryption
          </div>
          <h1
            className={`text-4xl font-semibold leading-snug sm:text-5xl sm:leading-snug lg:text-6xl lg:leading-snug text-center whitespace-pre-wrap`}
            suppressHydrationWarning
          >
            Inheritance Plan for your digital life
            {/* <TaglineABTest /> */}
          </h1>
          <p className="my-8 font-medium text-xl max-w-xl mx-auto text-center">
            When you pass away, we make sure your data (such as bank details,
            investments, properties, digital assets, etc.) get&apos;s to right
            people.
          </p>
          <div className="flex flex-col gap-2 items-center">
            <SimpleButton
              className="flex items-center gap-2 hover:gap-3 transition-all duration-200 ease-in-out rounded-full px-8 py-2"
              href="/app"
            >
              <span>Get Started </span>
              <BiRightArrowAlt />
            </SimpleButton>
            <Link href={"/how-it-works"}>
              <button className="py-2 px-8 font-semibold hover:underline">
                Learn How it works
              </button>
            </Link>
          </div>
        </div>
        {/* <PillarGrid/> */}
      </section>
    </>
  );
}

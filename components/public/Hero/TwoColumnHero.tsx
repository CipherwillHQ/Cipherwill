"use client";
import Link from "next/link";
import heroAnimation from "@/assets/animations/hero.json";
import Lottie from "lottie-react";
import herograd from "@/assets/images/hero-grad.png";

export default function TwoColumnHero() {
  return (
    <section
      className="bg-linear-to-b from-white to-yellow-100 text-black py-20"
      // style={{
      //   backgroundImage: `url('${herograd.src}')`,
        // backgroundImage: `url('https://i.pinimg.com/originals/19/a1/b2/19a1b216f31a5d18a054aef242ccacab.jpg')`,
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
    >
      <div className="flex flex-col items-center my-10 md:flex-row mx-auto max-w-7xl justify-between w-full py-4">
        <div className="px-4 sm:px-6 md:px-8 flex flex-col text-center md:text-left w-full md:w-1/2">
          {/* <div className="flex items-center gap-2 border w-fit py-1 px-4  mb-4 dark:border-neutral-600">
          <MdDevice />
          Cipherwill is availble on every device
        </div> */}
          <h1
            className={`text-5xl font-semibold sm:text-6xl lg:text-7xl`}
          >
            Insurance for your digital life
          </h1>
          <p className="my-8 font-medium dark:font-normal text-xl max-w-md mx-auto md:mx-0">
            When you pass away, we make sure your data (such as bank details,
            investments, properties, digital assets, etc.) get's to right
            people.
          </p>
          <div>
            <Link href={"/app"}>
              <button className="py-2 px-8 rounded-full font-semibold bg-black text-white dark:bg-white dark:text-black">
                Get Started
              </button>
            </Link>
            <Link href={"/how-it-works"}>
              <button className="py-2 px-8 font-semibold hover:opacity-80">
                Learn How it works
              </button>
            </Link>
          </div>
        </div>
        <div className="flex w-full overflow-hidden md:w-1/2 px-2 my-10s justify-center items-center">
          <Lottie
            animationData={heroAnimation}
            loop={true}
            style={{
              height: "400px",
            }}
          />
        </div>
      </div>
    </section>
  );
}

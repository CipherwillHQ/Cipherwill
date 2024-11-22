"use client";
import ComeupTransition from "@/components/animated/transitions/ComeUp";
import SimpleButton from "@/components/common/SimpleButton";
import Image from "next/image";
import securityImage from "@/assets/images/security.png";
import deliveryImage from "@/assets/images/delivery.png";
import personalizationImage from "@/assets/images/personalization.png";
import { GrDeliver, GrSecure, GrWorkshop } from "react-icons/gr";

export default function WhatIsCipherwill() {
  return (
    <ComeupTransition>
      <div className="w-full max-w-7xl mx-auto text-center p-4 my-20">
        <div className="flex flex-col sm:flex-row items-start md:items-end">
          {/* <Lottie
            animationData={confusedAnimation}
            loop={true}
            className="max-w-xs sm:min-w-[250px] md:max-w-[300px] mx-auto"
          /> */}
          <div className="text-center w-full">
            <h2 className="text-4xl md:text-7xl font-semibold py-4">
              Hey! Meet Cipherwill
            </h2>
            <p className="py-4 text-xl font-medium max-w-xl mx-auto">
              Cipherwill lets you store all your important information in one
              place and transfer it with trusted people when you die.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center py-12">
          <div className="flex flex-col items-center justify-between w-full p-4">
            {/* <Image
              src={securityImage}
              width={250}
              height={250}
              alt="cipherwill logo"
            /> */}
            <GrSecure size={50} className="text-neutral-800 my-8" />

            <h3 className="text-3xl font-bold pb-4">End to end encryption</h3>
            <div className="font-medium">
              Not even cipherwill can see your data. Every data point is
              encrypted on your device before it leaves your device.
            </div>
          </div>
          <div className="flex flex-col items-center justify-between w-full border-y sm:border-y-0 sm:border-x border-neutral-200  p-4">
            {/* <Image
              src={deliveryImage}
              width={250}
              height={250}
              alt="cipherwill logo"
            /> */}
            <GrDeliver size={50} className="text-neutral-800 my-8" />
            <h3 className="text-3xl font-bold pb-4">Fail safe delivery</h3>
            <div className="font-medium">
              100% guaranteed delivery of your data to your loved ones even if
              our system gets hacked, crashed or anything else.
            </div>
          </div>
          <div className="flex flex-col items-center justify-between w-full p-4">
            {/* <Image
              src={personalizationImage}
              width={230}
              height={230}
              alt="cipherwill logo"
            /> */}
            <GrWorkshop size={50} className="text-neutral-800 my-8" />
            <h3 className="text-3xl font-bold pb-4">Beyond just a software</h3>
            <div className="font-medium">
              Live chat with us at any time without any cost. We make sure
              personally that your data reaches right people.
            </div>
          </div>
        </div>
      </div>
    </ComeupTransition>
  );
}

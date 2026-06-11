"use client";
import ComeupTransition from "@/components/animated/transitions/ComeUp";
import { useRef } from "react";
import { BiSupport, BiTransferAlt } from "react-icons/bi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FaCircleChevronLeft, FaRegHandPeace } from "react-icons/fa6";
import { GiSecurityGate } from "react-icons/gi";
import { GrSecure } from "react-icons/gr";
import { IoHappyOutline } from "react-icons/io5";

const reasons = [
  {
    icon: <GiSecurityGate />,
    title: "Ultimate Security",
    content:
      "With end-to-end encryption, Cipherwill ensures your data remains private and secure, accessible only to you and your chosen beneficiaries.",
  },
  {
    icon: <FaRegMoneyBillAlt />,
    title: "Start with $0",
    content:
      "With Cipherwill, you can secure your digital assets with a free account - no credit card required to get started. Begin protecting your legacy today, commitment-free",
  },
  {
    icon: <GrSecure />,
    title: "Every Asset Secured",
    content:
      "From digital assets like cryptocurrencies and social media accounts to physical properties, investments, and legal documents, Cipherwill handles it all seamlessly.",
  },
  {
    icon: <BiTransferAlt />,
    title: "Seamless Transfer",
    content:
      "Upon your passing, Cipherwill automatically delivers your information to your beneficiaries, ensuring a smooth and stress-free transfer of your assets.",
  },
  {
    icon: <FaRegHandPeace />,
    title: "Peace of Mind",
    content:
      "Knowing that all your important information is securely stored and will be passed on as per your wishes provides unparalleled peace of mind.",
  },
  {
    icon: <IoHappyOutline />,
    title: "User-Friendly Interface",
    content:
      "Cipherwill’s intuitive platform makes it easy for anyone to set up and manage their digital will, without needing any technical expertise.",
  },
  {
    icon: <BiSupport />,
    title: "Personal Support",
    content:
      "If your beneficiaries encounter any issues accessing your information, Cipherwill’s dedicated team is there to personally assist and ensure the transfer is completed successfully.",
  },
];
export default function WhyChooseCipherwill() {
  const scrollRef = useRef(null);
  return (
    <section className="bg-linear-to-b from-neutral-900 to-black text-white py-20">
      <div className="w-full max-w-7xl mx-auto p-4">
        <h2 className="text-4xl md:text-5xl font-semibold pb-8 text-center">
          We bring something{" "}
          <span className="font-playfair italic">unique</span> to the table.
        </h2>
        <div className="text-center text-lg text-neutral-300 pb-8">
          Here’s why Cipherwill is the smarter choice over any other option.
        </div>
      </div>
      <div className="w-full">
        <div
          ref={scrollRef}
          className="flex gap-4 p-2 overflow-y-auto px-4 xl:px-24 2xl:px-56 no-scrollbar"
        >
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border border-neutral-600 bg-linear-to-bl from-neutral-900 to-black p-4 rounded-xl min-w-80 max-w-80"
            >
              <div className="p-2 h-fit w-fit text-4xl">{reason.icon}</div>
              <div>
                <h3 className="text-lg font-bold py-4">{reason.title}</h3>
                <p className="font-medium text-neutral-400">{reason.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            className="border border-neutral-600 hover:cursor-pointer hover:bg-neutral-900 rounded-full h-12 w-12 flex items-center justify-center"
            onClick={() => {
              if(!scrollRef.current) return;
              (scrollRef.current as any).scrollTo({
                left: (scrollRef.current as Element).scrollLeft - 300,
                behavior: "smooth",
              });
            }}
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            className="border border-neutral-600 hover:cursor-pointer hover:bg-neutral-900 rounded-full h-12 w-12 flex items-center justify-center"
            onClick={() => {
              if(!scrollRef.current) return;
              // scroll 300 px to the right
              (scrollRef.current as any).scrollTo({
                left: (scrollRef.current as Element).scrollLeft + 300,
                behavior: "smooth",
              });
            }}
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}

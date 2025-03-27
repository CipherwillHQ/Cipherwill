"use client";
import Link from "next/link";
import { BsCheck } from "react-icons/bs";
import { LuDot } from "react-icons/lu";

export default function PriceTeaser() {
  return (
    <div className="flex flex-col sm:flex-row justify-evenly gap-4 my-16 items-center sm:items-start">
      <div className="p-2 w-full max-w-md border rounded-lg">
        <div className="px-6 py-1 w-fit rounded-full bg-orange-100 text-dark font-semibold">
          Lifetime free
        </div>
        <h2 className="text-4xl font-extrabold text-center my-6">
          <span>$0</span>
          <span className="text-lg">/Lifetime</span>
        </h2>
        <Link href={"/app/billing"}>
          <button className="p-2 w-full border hover:cursor-pointer border-primary-100 hover:bg-primary-50 text-primary-950 rounded-md transition-colors duration-300 ease-in-out">
            Get Started
          </button>
        </Link>
        <h3 className="text-gray-500 text-sm font-semibold py-4 text-center">
          Get started with cipherwill and create you digital will
          <br />
          <span className="opacity-0">Getting started is easy</span>
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <LuDot size={25} className="text-gray-700" />
            Limited Segments
          </li>
          <li className="flex items-center gap-2">
            <LuDot size={25} className="text-gray-700" />5 Beneficiaries
          </li>
          <li className="flex items-center gap-2">
            <LuDot size={25} className="text-gray-700" />
            Live Chat Support
          </li>
        </ul>
      </div>
      <div className="p-2 w-full max-w-md border rounded-lg">
        <div className="flex items-center gap-2 justify-between">
          <div className="px-6 py-1 w-fit rounded-full bg-orange-300 text-orange-950  font-semibold">
            Premium
          </div>
          <div className="text-sm font-bold text-right">
            <span className="text-accent-700">30% Discount</span> For Limited
            Period
          </div>
        </div>

        {/* <div className="flex items-center gap-2 justify-center">
          <div className="line-through text-xl">$60.00</div>
          <div className="bg-yellow-500 rounded-sm p-1 text-xs font-semibold text-black">-33%</div>
        </div> */}
        <h2 className="text-4xl font-extrabold text-center my-6">
          <span className="mr-2 line-through text-neutral-700">$60</span>
          <span>$39.99</span>
          <span className="text-lg">/Year</span>
        </h2>
        <Link href={"/app/billing"}>
          <button className="p-2 w-full bg-primary hover:cursor-pointer hover:bg-primary-900 text-white rounded-md transition-colors duration-300 ease-in-out">
            Get Started
          </button>
        </Link>

        <h3 className="text-gray-500 text-sm font-semibold py-4 text-center">
          Protect all your digital assets and full platform access
          <br />
          For less than <span className="text-black font-bold">a coffee </span>
          per month
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <LuDot size={25} className="text-green-700" />
            All Segments
          </li>
          <li className="flex items-center gap-2">
            <LuDot size={25} className="text-green-700" />
            Unlimited beneficiaries
          </li>
          <li className="flex items-center gap-2">
            <LuDot size={25} className="text-green-700" />
            Early access to new features
          </li>
        </ul>
      </div>
    </div>
  );
}

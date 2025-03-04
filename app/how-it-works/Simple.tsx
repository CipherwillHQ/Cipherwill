"use client";

import { GrDown } from "react-icons/gr";

export default function Simple() {
  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-20 px-2">
      <h2 className="text-3xl sm:text-5xl font-bold text-center">
        Getting started is simple
      </h2>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4 py-8 xl:px-0">
        <div className="border border-[#F1F1F1] bg-gradient-to-b from-white to-[#F4F4F4] p-2 rounded-lg">
          <div className="font-bold">1.</div>
          <h3 className="font-bold py-2 text-lg">Signup</h3>
          <p>
            Create your secure account in with just your Email ID
          </p>
        </div>
        <div className="border border-[#F1F1F1] bg-gradient-to-b from-white to-[#F4F4F4] p-2 rounded-lg">
          <div className="font-bold">2.</div>
          <h3 className="font-bold py-2 text-lg">Add data</h3>
          <p>
            Add information like notes, wallets, photos, and more
          </p>
        </div>
        <div className="border border-[#F1F1F1] bg-gradient-to-b from-white to-[#F4F4F4] p-2 rounded-lg">
          <div className="font-bold">3.</div>
          <h3 className="font-bold py-2 text-lg">Add beneficiary</h3>
          <p>
            Add Email of people who will receive your data if something happens to you
          </p>
        </div>
        <div className="border border-[#F1F1F1] bg-gradient-to-b from-white to-[#F4F4F4] p-2 rounded-lg">
          <div className="font-bold">4.</div>
          <h3 className="font-bold py-2 text-lg">All set & done</h3>
          <p>
            Visit Cipherwill regularly and when you can&apos;t, we will deliver your data to your loved ones
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          window.scrollBy({
            top: 150,
            behavior: "smooth",
          });
        }}
        className="flex items-center gap-4 mx-auto mt-8"
      >
        <GrDown className="animate-bounce text-xs" />
        <span>Scroll down to know more</span>
        <GrDown className="animate-bounce text-xs" />
      </button>
    </section>
  );
}

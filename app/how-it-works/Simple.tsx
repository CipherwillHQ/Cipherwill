"use client";

import { GrDown } from "react-icons/gr";
export default function Simple() {
  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-20 px-2">
      <h2 className="text-3xl sm:text-5xl font-bold text-center">
        Getting started is simple
      </h2>
      <p className="text-center text-base sm:text-xl p-4 max-w-2xl mx-auto">
        As easy as saving a password - just add your
        important details, add who will receive the data, and rest knowing
        your data is protected.
      </p>
      <div className="grid md:grid-cols-3 gap-4 px-4 py-8 xl:px-0 text-lg">
        <div className="border border-[#F1F1F1] bg-white p-2 rounded-lg shadow-[0_4px_20px_rgb(0,0,0,0.07)] hover:shadow-lg hover:-translate-y-2 transition-all">
          <div className="border border-[#F1F1F1] p-5 rounded-lg">
            <div className="font-bold text-5xl">1.</div>
            <h3 className="font-bold py-2 text-2xl">Signup & add data</h3>
            <p>
              Create your account & Add information like notes, wallets, photos,
              and more
            </p>
          </div>
        </div>

        <div className="border border-[#F1F1F1] bg-white p-2 rounded-lg shadow-[0_4px_20px_rgb(0,0,0,0.07)] hover:shadow-lg hover:-translate-y-2 transition-all">
          <div className="border border-[#F1F1F1] p-5 rounded-lg">
            <div className="font-bold text-5xl">2.</div>
            <h3 className="font-bold py-2 text-2xl">Add beneficiary</h3>
            <p>
              Add Email of people who will receive your data if something
              happens to you
            </p>
          </div>
        </div>

        <div className="border border-[#F1F1F1] bg-white p-2 rounded-lg shadow-[0_4px_20px_rgb(0,0,0,0.07)] hover:shadow-lg hover:-translate-y-2 transition-all">
          <div className="border border-[#F1F1F1] p-5 rounded-lg">
            <div className="font-bold text-5xl">3.</div>
            <h3 className="font-bold py-2 text-2xl">All set & done</h3>
            <p>
              Visit regularly and when you can&apos;t, we will deliver your data
              to your loved ones
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          window.scrollBy({
            top: 300,
            behavior: "smooth",
          });
        }}
        className="flex items-center gap-4 mx-auto mt-8"
      >
        <GrDown className="animate-bounce text-sm" />
        <span className="text-lg">Scroll down to know more</span>
        <GrDown className="animate-bounce text-sm" />
      </button>
    </section>
  );
}

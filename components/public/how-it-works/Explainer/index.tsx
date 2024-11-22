"use client";

import { useState } from "react";
import SimpleExplainer from "./SimpleExplainer";
import TechnicalExplainer from "./TechnicalExplainer";
import ScrollExplainer from "./ScrollExplainer";

export default function Explainer() {
  const [mode, setMode] = useState<"simple" | "technical">("simple");

  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 px-4">
        <div
          className={`px-6 py-2 rounded-full text-center ${
            mode === "simple"
              ? "font-semibold bg-black text-white p-2 border-b-2 border-orange-500 cursor-pointer"
              : "text-black border font-medium cursor-pointer"
          }`}
          onClick={() => {
            setMode("simple");
          }}
        >
          I prefer simpler explanation
        </div>
        <div
          className={`px-6 py-2 rounded-full text-center ${
            mode === "technical"
              ? "font-semibold bg-black text-white p-2 border-b-2 border-orange-500 cursor-pointer"
              : "text-black border font-medium cursor-pointer"
          }`}
          onClick={() => {
            setMode("technical");
          }}
        >
          I understand how encryption works
        </div>
      </div>
      <div className="px-2 max-w-7xl mx-auto">
        {mode === "simple" && <ScrollExplainer />}
        {/* {mode === "simple" && <SimpleExplainer/>} */}
        {mode === "technical" && <TechnicalExplainer />}
      </div>
    </section>
  );
}

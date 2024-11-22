"use client";

import { FaAngleDown } from "react-icons/fa6";

export default function ScrollDownButton() {
  return (
    <button
      className="flex items-center gap-3 text-gray-500 justify-center mx-auto"
      onClick={() => {
        // scroll down to comapre section

        window.scrollTo({
          top: window.scrollY + 300,
          behavior: "smooth",
        });
      }}
    >
      <FaAngleDown />
      <span>See detailed pricing comparison</span>
      <FaAngleDown />
    </button>
  );
}

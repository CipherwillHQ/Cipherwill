"use client";

import themeAtom from "@/state/common/themeAtom";
import { BsCircle, BsCircleFill } from "react-icons/bs";
import { useRecoilState } from "recoil";

export default function Appearance() {
  const [currentTheme, setCurrentTheme] = useRecoilState(themeAtom);
  return (
    <div className="border border-default w-full max-w-2xl rounded-md bg-secondary">
      <h2 className="font-semibold border-b border-default p-3">Appearance</h2>
      <div className="p-3">
        <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
          We will use your selected theme for Cipherwill platform.
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
          <button
            className={`p-2 border rounded-md
                ${
                  currentTheme === "dark"
                    ? "font-semibold border-white"
                    : "border-default"
                }
                `}
            onClick={() => setCurrentTheme("dark")}
          >
            <svg
              className="w-full sm:w-[150px]"
              viewBox="0 0 163 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_701_65549)">
                <rect
                  x="0.742188"
                  width="161.5"
                  height="88"
                  rx="6"
                  fill="#121212"
                ></rect>
                <mask id="path-3-inside-1_701_65549" fill="white">
                  <path d="M0.742188 6C0.742188 2.68629 3.42848 0 6.74219 0H13.7422V88H6.74219C3.42848 88 0.742188 85.3137 0.742188 82V6Z"></path>
                </mask>
                <path
                  d="M0.742188 6C0.742188 2.68629 3.42848 0 6.74219 0H13.7422V88H6.74219C3.42848 88 0.742188 85.3137 0.742188 82V6Z"
                  fill="#121212"
                ></path>
                <path
                  d="M0.742188 0H13.7422H0.742188ZM13.7422 88H0.742188H13.7422ZM0.742188 88V0V88ZM14.7422 0V88H12.7422V0H14.7422Z"
                  fill="#292929"
                  mask="url(#path-3-inside-1_701_65549)"
                ></path>
                <mask id="path-5-inside-2_701_65549" fill="white">
                  <path d="M156.242 -2.62268e-07C159.556 -1.17421e-07 162.242 2.68629 162.242 6L162.242 13L13.7422 13L13.7422 -6.49114e-06L156.242 -2.62268e-07Z"></path>
                </mask>
                <path
                  d="M156.242 -2.62268e-07C159.556 -1.17421e-07 162.242 2.68629 162.242 6L162.242 13L13.7422 13L13.7422 -6.49114e-06L156.242 -2.62268e-07Z"
                  fill="#121212"
                ></path>
                <path
                  d="M162.242 0L162.242 13L162.242 0ZM13.7422 13L13.7422 -6.49114e-06L13.7422 13ZM13.7422 -6.49114e-06L162.242 0L13.7422 -6.49114e-06ZM162.242 14L13.7422 14L13.7422 12L162.242 12L162.242 14Z"
                  fill="#292929"
                  mask="url(#path-5-inside-2_701_65549)"
                ></path>
                <rect
                  x="44.7552"
                  y="21.5"
                  width="86.4738"
                  height="23.5"
                  rx="2.5"
                  fill="#1F1F1F"
                  stroke="#292929"
                ></rect>
                <rect
                  x="44.7552"
                  y="51.5"
                  width="86.4738"
                  height="23.5"
                  rx="2.5"
                  fill="#1F1F1F"
                  stroke="#292929"
                ></rect>
                <rect
                  x="52.9406"
                  y="28"
                  width="19.2318"
                  height="1.5"
                  rx="0.75"
                  fill="#B4B4B4"
                ></rect>
                <rect
                  x="52.9406"
                  y="56.5"
                  width="19.2318"
                  height="1.5"
                  rx="0.75"
                  fill="#B4B4B4"
                ></rect>
                <rect
                  x="78.3762"
                  y="28"
                  width="19.2318"
                  height="1.5"
                  rx="0.75"
                  fill="#FAFAFA"
                ></rect>
                <rect
                  x="78.3762"
                  y="56.5"
                  width="19.2318"
                  height="1.5"
                  rx="0.75"
                  fill="#FAFAFA"
                ></rect>
                <rect
                  x="78.3762"
                  y="33.25"
                  width="44.0471"
                  height="1.5"
                  rx="0.75"
                  fill="#FAFAFA"
                ></rect>
                <rect
                  x="78.3762"
                  y="61.75"
                  width="44.0471"
                  height="1.5"
                  rx="0.75"
                  fill="#FAFAFA"
                ></rect>
                <rect
                  x="18.4922"
                  y="4.625"
                  width="20.5"
                  height="3.75"
                  rx="1.875"
                  fill="#3ECF8E"
                ></rect>
                <rect
                  x="44.2552"
                  y="4.625"
                  width="20.5"
                  height="3.75"
                  rx="1.875"
                  fill="#4D4D4D"
                ></rect>
                <rect
                  x="69.5052"
                  y="4.625"
                  width="20.5"
                  height="3.75"
                  rx="1.875"
                  fill="#4D4D4D"
                ></rect>
                <rect
                  x="101.923"
                  y="28"
                  width="20.5"
                  height="1.5"
                  rx="0.75"
                  fill="#DB8E00"
                ></rect>
                <rect
                  x="5.36719"
                  y="4.625"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#4D4D4D"
                ></rect>
                <rect
                  x="5.36719"
                  y="13.375"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#4D4D4D"
                ></rect>
                <rect
                  x="5.36719"
                  y="20.875"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#4D4D4D"
                ></rect>
                <rect
                  x="5.36719"
                  y="28.375"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#4D4D4D"
                ></rect>
                <rect
                  x="5.36719"
                  y="35.875"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#4D4D4D"
                ></rect>
                <rect
                  x="5.36719"
                  y="78.875"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#4D4D4D"
                ></rect>
              </g>
              <rect
                x="1.24219"
                y="0.5"
                width="160.5"
                height="87"
                rx="5.5"
                stroke="#292929"
              ></rect>
              <defs>
                <clipPath id="clip0_701_65549">
                  <rect
                    x="0.742188"
                    width="161.5"
                    height="88"
                    rx="6"
                    fill="white"
                  ></rect>
                </clipPath>
              </defs>
            </svg>
            <div className="flex items-center gap-1 pt-2 text-sm">
              {currentTheme === "dark" ? <BsCircleFill /> : <BsCircle />}
              <span>Dark</span>
            </div>
          </button>
          <button
            className={`p-2 border border-default rounded-md
            ${currentTheme === "light" && "font-semibold border-black"}
            `}
            onClick={() => setCurrentTheme("light")}
          >
            <svg
              className="w-full sm:w-[150px]"
              viewBox="0 0 162 88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_701_65608)">
                <rect
                  x="0.242188"
                  width="161.5"
                  height="88"
                  rx="6"
                  fill="#F8F9FA"
                ></rect>
                <mask id="path-3-inside-1_701_65608" fill="white">
                  <path d="M0.242188 6C0.242188 2.68629 2.92848 0 6.24219 0H13.2422V88H6.24219C2.92848 88 0.242188 85.3137 0.242188 82V6Z"></path>
                </mask>
                <path
                  d="M0.242188 6C0.242188 2.68629 2.92848 0 6.24219 0H13.2422V88H6.24219C2.92848 88 0.242188 85.3137 0.242188 82V6Z"
                  fill="#F8F9FA"
                ></path>
                <path
                  d="M0.242188 0H13.2422H0.242188ZM13.2422 88H0.242188H13.2422ZM0.242188 88V0V88ZM14.2422 0V88H12.2422V0H14.2422Z"
                  fill="#E6E8EB"
                  mask="url(#path-3-inside-1_701_65608)"
                ></path>
                <mask id="path-5-inside-2_701_65608" fill="white">
                  <path d="M155.742 -2.62268e-07C159.056 -1.17421e-07 161.742 2.68629 161.742 6L161.742 13L13.2422 13L13.2422 -6.49114e-06L155.742 -2.62268e-07Z"></path>
                </mask>
                <path
                  d="M155.742 -2.62268e-07C159.056 -1.17421e-07 161.742 2.68629 161.742 6L161.742 13L13.2422 13L13.2422 -6.49114e-06L155.742 -2.62268e-07Z"
                  fill="#F8F9FA"
                ></path>
                <path
                  d="M161.742 0L161.742 13L161.742 0ZM13.2422 13L13.2422 -6.49114e-06L13.2422 13ZM13.2422 -6.49114e-06L161.742 0L13.2422 -6.49114e-06ZM161.742 14L13.2422 14L13.2422 12L161.742 12L161.742 14Z"
                  fill="#E6E8EB"
                  mask="url(#path-5-inside-2_701_65608)"
                ></path>
                <rect
                  x="44.2552"
                  y="21.5"
                  width="86.4738"
                  height="23.5"
                  rx="2.5"
                  fill="#FCFCFC"
                  stroke="#E6E8EB"
                ></rect>
                <rect
                  x="44.2552"
                  y="51.5"
                  width="86.4738"
                  height="23.5"
                  rx="2.5"
                  fill="#FCFCFC"
                  stroke="#E6E8EB"
                ></rect>
                <rect
                  x="52.4406"
                  y="28"
                  width="19.2318"
                  height="1.5"
                  rx="0.75"
                  fill="#525252"
                ></rect>
                <rect
                  x="52.4406"
                  y="56.5"
                  width="19.2318"
                  height="1.5"
                  rx="0.75"
                  fill="#525252"
                ></rect>
                <rect
                  x="77.8762"
                  y="28"
                  width="19.2318"
                  height="1.5"
                  rx="0.75"
                  fill="#11181C"
                ></rect>
                <rect
                  x="77.8762"
                  y="56.5"
                  width="19.2318"
                  height="1.5"
                  rx="0.75"
                  fill="#11181C"
                ></rect>
                <rect
                  x="77.8762"
                  y="33.25"
                  width="44.0471"
                  height="1.5"
                  rx="0.75"
                  fill="#11181C"
                ></rect>
                <rect
                  x="77.8762"
                  y="61.75"
                  width="44.0471"
                  height="1.5"
                  rx="0.75"
                  fill="#11181C"
                ></rect>
                <rect
                  x="17.9922"
                  y="4.625"
                  width="20.5"
                  height="3.75"
                  rx="1.875"
                  fill="#3FCF8E"
                ></rect>
                <rect
                  x="43.7552"
                  y="4.625"
                  width="20.5"
                  height="3.75"
                  rx="1.875"
                  fill="#B2B2B2"
                ></rect>
                <rect
                  x="69.0052"
                  y="4.625"
                  width="20.5"
                  height="3.75"
                  rx="1.875"
                  fill="#B2B2B2"
                ></rect>
                <rect
                  x="101.423"
                  y="28"
                  width="20.5"
                  height="1.5"
                  rx="0.75"
                  fill="#FFB224"
                ></rect>
                <rect
                  x="4.86719"
                  y="4.625"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#B2B2B2"
                ></rect>
                <rect
                  x="4.86719"
                  y="13.375"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#B2B2B2"
                ></rect>
                <rect
                  x="4.86719"
                  y="20.875"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#B2B2B2"
                ></rect>
                <rect
                  x="4.86719"
                  y="28.375"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#B2B2B2"
                ></rect>
                <rect
                  x="4.86719"
                  y="35.875"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#B2B2B2"
                ></rect>
                <rect
                  x="4.86719"
                  y="78.875"
                  width="3.75"
                  height="3.75"
                  rx="1"
                  fill="#B2B2B2"
                ></rect>
              </g>
              <rect
                x="0.742188"
                y="0.5"
                width="160.5"
                height="87"
                rx="5.5"
                stroke="#E6E8EB"
              ></rect>
              <defs>
                <clipPath id="clip0_701_65608">
                  <rect
                    x="0.242188"
                    width="161.5"
                    height="88"
                    rx="6"
                    fill="white"
                  ></rect>
                </clipPath>
              </defs>
            </svg>
            <div className="flex items-center gap-1 pt-2 text-sm">
              {currentTheme === "light" ? <BsCircleFill /> : <BsCircle />}
              <span>Light</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

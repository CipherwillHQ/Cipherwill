import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";

export const gilroy = localFont({
  src: [
    {
      path: "../assets/font/gilroy/Gilroy-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../assets/font/gilroy/Gilroy-UltraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-UltraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../assets/font/gilroy/Gilroy-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../assets/font/gilroy/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-RegularItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/font/gilroy/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../assets/font/gilroy/Gilroy-Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-SemiboldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../assets/font/gilroy/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../assets/font/gilroy/Gilroy-Extrabold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-ExtraboldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../assets/font/gilroy/Gilroy-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
});

export const gilroyHeavy = localFont({
  src: [
    {
      path: "../assets/font/gilroy/Gilroy-Heavy.ttf",
      style: "normal",
    },
    {
      path: "../assets/font/gilroy/Gilroy-Heavy.ttf",
      style: "italic",
    },
  ],
});

export const PlayfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: '--font-playfair-display',
});

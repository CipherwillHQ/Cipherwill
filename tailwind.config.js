/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./components/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./factory/**/*.{html,js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        screen: [
          "100vh", // fallback for IR and Opera
          "100dvh", // supported dynamic height
        ],
      },
      colors: {
        primary: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#0c0c0c",
        },
        secondary: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#171717",
        },
        accent: {
          50: "#fff4ed",
          100: "#ffe6d5",
          200: "#feccaa",
          300: "#fdac74",
          400: "#fb8a3c",
          500: "#f97316",
          600: "#ea670c",
          700: "#c2570c",
          800: "#9a4a12",
          900: "#7c3d12",
          950: "#432007",
        },
      },
    },
  },
  plugins: [
    ({ addComponents }) => {
      addComponents([
        {
          ".border-default": {
            "@apply border-neutral-300 dark:border-neutral-800": {},
          },
          ".bg-primary": {
            "@apply bg-primary-50 dark:bg-primary-950": {},
          },
          ".bg-secondary": {
            "@apply bg-white dark:bg-secondary-950": {},
          },
          ".bg-accent": {
            "@apply bg-accent-500": {},
          },
          ".font-playfair": {
            "font-family": "var(--font-playfair-display)",
          },
        },
      ]);
    },
  ],
};

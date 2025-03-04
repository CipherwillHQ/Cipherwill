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
          DEFAULT: "#003ecb",
          50: "#ecf7ff",
          100: "#d4ecff",
          200: "#b2dfff",
          300: "#7dcdff",
          400: "#40b0ff",
          500: "#148aff",
          600: "#0066ff",
          700: "#004eff",
          800: "#003ecb",
          900: "#083aa0",
          950: "#0a2461",
        },
        dark: {
          DEFAULT: "#101113",
          50: "#f4f5f7",
          100: "#e4e7e9",
          200: "#ccd1d5",
          300: "#a8b0b8",
          400: "#7d8893",
          500: "#626d78",
          600: "#545c66",
          700: "#484e56",
          800: "#40444a",
          900: "#383b41",
          950: "#101113",
        },
        secondary: {
          50: "#f4f5f7",
          100: "#e4e7e9",
          200: "#ccd1d5",
          300: "#a8b0b8",
          400: "#7d8893",
          500: "#626d78",
          600: "#545c66",
          700: "#484e56",
          800: "#40444a",
          900: "#383b41",
          950: "#101113",
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

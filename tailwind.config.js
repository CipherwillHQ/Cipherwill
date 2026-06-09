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
      fontFamily: {
        playfair: ["var(--font-playfair-display)", "serif"],
        gilroy: ["var(--font-gilroy)", "sans-serif"],
        mono: ["JetBrains Mono", "Geist Mono", "monospace"],
      },
      height: {
        screen: [
          "100vh", // fallback for IR and Opera
          "100dvh", // supported dynamic height
        ],
      },
      boxShadow: {
        "level-1": "0 2px 8px rgba(0,0,0,0.08)",
        "level-2": "0 8px 24px rgba(0,0,0,0.12)",
        "level-3": "0 16px 48px rgba(0,0,0,0.16)",
      },
      zIndex: {
        sticky: "100",
        dropdown: "200",
        modal: "300",
        toast: "400",
      },
      transitionTimingFunction: {
        "cw-ease": "cubic-bezier(0.25, 1, 0.5, 1)",
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
        navy: {
          DEFAULT: "#0B1B2B",
          50: "#f0f4f8",
          100: "#dbe4ed",
          200: "#bacce0",
          300: "#94b0d0",
          400: "#6e93bf",
          500: "#4e79ab",
          600: "#3c6090",
          700: "#2d4a70",
          800: "#1c3350",
          900: "#112236",
          950: "#0B1B2B",
        },
        cream: "#FBF9F1",
        parchment: "#F4F1EA",
        forest: "#2A363B",
        mahogany: "#2C1A0E",
        sage: "#7AA089",
        clay: "#D4A390",
        error: "#C0392B",
        warning: "#C87941",
        success: "#7AA089",
        info: "#003ecb",
      },
    },
  },
  plugins: [
    ({ addComponents }) => {
      addComponents([
        {
          ".border-default": {
            "@apply border-forest/10 dark:border-cream/10": {},
          },
          ".bg-primary": {
            "@apply bg-cream dark:bg-navy": {},
          },
          ".bg-secondary": {
            "@apply bg-white dark:bg-navy-900": {},
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
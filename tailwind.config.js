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
        cream: "#FBF9F1",
        dashboardCream: "#f8f8f6",
        parchment: "#F4F1EA",
        forest: "#2A363B",
        mahogany: "#2C1A0E",
        sage: "#7AA089",
        clay: "#D4A390",
        error: "#C0392B",
        warning: "#C87941",
        success: "#7AA089",
        info: "#003ecb",
        darkCanvas: "#1f1f1e",
        darkCard: "#2c2c2a",
        darkAccent: "#333330",
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
            "@apply bg-dashboardCream dark:bg-darkCanvas": {},
          },
          ".bg-secondary": {
            "@apply bg-white dark:bg-darkCard": {},
          },
          ".bg-accent": {
            "@apply bg-clay": {},
          },
          ".font-playfair": {
            "font-family": "var(--font-playfair-display)",
          },
        },
      ]);
    },
  ],
};
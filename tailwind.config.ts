import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#102a43",
          900: "#0b1d30",
          950: "#06101e",
        },
        gold: {
          50: "#fffdf5",
          100: "#fff9e6",
          200: "#fff0bf",
          300: "#ffe799",
          400: "#ffd54f",
          500: "#e5a919",
          600: "#c68a0c",
          700: "#996b08",
          800: "#704d05",
          900: "#473002",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(11, 29, 48, 0.1), 0 4px 6px -2px rgba(11, 29, 48, 0.05)',
        'luxury-hover': '0 20px 40px -10px rgba(11, 29, 48, 0.2), 0 8px 12px -3px rgba(11, 29, 48, 0.1)',
        'gold-glow': '0 0 20px rgba(229, 169, 25, 0.35)',
      },
    },
  },
  plugins: [],
};
export default config;

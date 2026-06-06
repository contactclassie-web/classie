import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Poppins", "sans-serif"],
        serif:   ["var(--font-cormorant)", "Georgia", "serif"],
        display: ['"DM Serif Display"', "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#3B5373",   // exact original button color
          dark:    "#2a3d55",
          light:   "#4f6a8a",
        },
        classie: {
          black:  "#000000",    // exact original foreground
          gray:   "#6b6b6b",
          light:  "#f7f7f7",
          border: "#e8e8e8",
          navy:   "#3B5373",   // exact original navy
        },
      },
      borderRadius: {
        pill: "24px",
      },
    },
  },
  plugins: [],
};
export default config;

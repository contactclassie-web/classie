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
        sans:  ["Poppins", "sans-serif"],
        serif: ['"DM Serif Display"', "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#3D4F5F",
          dark:    "#2e3c49",
          light:   "#4f6476",
        },
        classie: {
          black:  "#1a1a1a",
          gray:   "#6b6b6b",
          light:  "#f7f7f7",
          border: "#e8e8e8",
          navy:   "#3D4F5F",
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

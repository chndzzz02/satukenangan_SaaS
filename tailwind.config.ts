import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F4F0EA",
        paper: "#FFFDF9",
        ink: "#171717",
        terracotta: {
          DEFAULT: "#E4572E",
          hover: "#C94422",
          light: "#FCE8E1",
        },
        mustard: {
          DEFAULT: "#F2B84B",
          dark: "#C68B25",
          light: "#FDF5E6",
        },
        moss: {
          DEFAULT: "#315C4B",
          dark: "#214335",
          light: "#E5F0EA",
        },
        "dusk-blue": {
          DEFAULT: "#34455C",
          dark: "#232F40",
          light: "#465B78",
        },
        sand: "#E7DCC7",
        line: "#D8CBB2",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        ui: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        polaroid: "0 10px 25px -5px rgba(36, 31, 28, 0.12), 0 8px 10px -6px rgba(36, 31, 28, 0.08)",
        "polaroid-hover": "0 20px 35px -5px rgba(36, 31, 28, 0.22), 0 10px 15px -5px rgba(36, 31, 28, 0.15)",
        shutter: "inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 12px rgba(199, 81, 31, 0.35)",
        stamp: "0 4px 12px rgba(0,0,0,0.06)",
      },
      keyframes: {
        shutterClick: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.93)" },
        },
        flashEffect: {
          "0%": { opacity: "0" },
          "20%": { opacity: "0.95" },
          "100%": { opacity: "0" },
        },
        filmGrain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -5%)" },
          "30%": { transform: "translate(5%, -10%)" },
          "50%": { transform: "translate(-15%, 15%)" },
          "70%": { transform: "translate(10%, 10%)" },
          "90%": { transform: "translate(-10%, 5%)" },
        },
      },
      animation: {
        "shutter-click": "shutterClick 0.15s ease-in-out",
        flash: "flashEffect 0.3s ease-out forwards",
        grain: "filmGrain 8s steps(10) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

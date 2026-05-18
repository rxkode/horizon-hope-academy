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
        navy: {
          DEFAULT: "#0d1b45",
          mid:     "#0f1d42",
          soft:    "#162660",
          edge:    "#1c3178",
          light:   "#1e2d6b",
        },
        gold: {
          DEFAULT: "#c4922a",
          light:   "#d4a84a",
          pale:    "#f5dbb8",
          bright:  "#e8c050",
        },
        mist:  "#a8b8d8",
        sage:  "#7a8fc4",
        cream: "#f6f2ea",
      },
      fontFamily: {
        serif:  ["Lora", "Georgia", "serif"],
        sans:   ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":    "fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "marquee":    "marquee 40s linear infinite",
        "float":      "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "navy-gradient": "linear-gradient(160deg, #0b1535 0%, #0f1d42 55%, #101e4a 100%)",
        "gold-gradient": "linear-gradient(135deg, #c4922a, #d4a84a)",
      },
    },
  },
  plugins: [],
};
export default config;

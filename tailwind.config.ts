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
        brand: {
          50: "#fff5f5",
          100: "#ffe0e0",
          200: "#ffc5c5",
          300: "#ff8080",
          400: "#ee4040",
          500: "#cc0000",   // Primary Container — vibrant CTA red
          600: "#9e0000",   // Primary — brand moments
          700: "#b52619",   // Secondary — interactive states
          800: "#7a1800",
          900: "#500f00",
          950: "#280800",
        },
        surface: {
          DEFAULT: "#f9f9f9",
          low: "#f3f3f3",
          lowest: "#ffffff",
          high: "#ececec",
          dim: "#dadada",
        },
        outline: {
          DEFAULT: "#e8bdb6",
        },
        neutral: {
          50: "#f9f9f9",
          100: "#f3f3f3",
          200: "#e4e4e4",
          300: "#d1d1d1",
          400: "#b4b4b4",
          500: "#9a9a9a",
          600: "#6e6e6e",
          700: "#5e3f3a",   // on-surface-variant — warm body text
          800: "#404040",
          900: "#1a1a1a",
          950: "#0d0d0d",
        },
      },
      fontFamily: {
        sans: ["Geom", "sans-serif"],
      },
      boxShadow: {
        brand: "0px 20px 40px rgba(158, 0, 0, 0.05)",
        "brand-md": "0px 12px 28px rgba(158, 0, 0, 0.08)",
        "brand-lg": "0px 24px 56px rgba(158, 0, 0, 0.10)",
      },
    },
  },
  plugins: [],
};
export default config;

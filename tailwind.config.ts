import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf4ec",
          100: "#fae6d1",
          200: "#f2c99b",
          300: "#e8a862",
          400: "#dc8935",
          500: "#b5651d", // primary — warm academic brass/copper (Ajanta manuscript tone)
          600: "#954f17",
          700: "#763d14",
          800: "#5c3113",
          900: "#4a2a12",
          950: "#2a1608",
        },
        ink: {
          50: "#f5f6f7",
          100: "#e6e8eb",
          200: "#c7ccd2",
          300: "#9aa3ad",
          400: "#687380",
          500: "#4a5563",
          600: "#3a4451",
          700: "#2f3742",
          800: "#1f242c",
          900: "#14171c",
          950: "#0a0c0f",
        },
        // Warm "manuscript paper" neutrals — page backgrounds and soft borders on the public site.
        paper: {
          50: "#fcfaf6",
          100: "#f8f4ec",
          200: "#efe7d8",
          300: "#e3d7c0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "Cambria", "'Times New Roman'", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,23,28,0.05), 0 2px 14px rgba(20,23,28,0.04)",
        lift: "0 10px 30px -8px rgba(74,42,18,0.22), 0 4px 10px -4px rgba(20,23,28,0.08)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 50px -12px rgba(0,0,0,0.55)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

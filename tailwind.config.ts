import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444", // Brutalist Red
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        brand: {
          bg: "#000000", // Pure Black
          surface: "#ffffff", // Pure White
          "surface-muted": "#f3f4f6",
          ink: "#000000",
          "ink-muted": "#4b5563",
          "ink-invert": "#ffffff",
          border: "#000000",
          "border-muted": "#e5e7eb",
          accent: "#ef4444",
        },
      },
      fontFamily: {
        display: [
          '"Bricolage Grotesque"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: ['"Source Serif 4"', "Georgia", '"Times New Roman"', "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
};

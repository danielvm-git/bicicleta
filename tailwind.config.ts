import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#f4f0e8",
          "bg-elevated": "#fffcf7",
          surface: "#ffffff",
          ink: "#1a1d21",
          "ink-muted": "#4a5058",
          "ink-faint": "#6e7682",
          border: "#d9d0c4",
          "border-strong": "#b8ae9e",
          accent: "#0d6b6b",
          "accent-hover": "#0a5555",
          "accent-subtle": "#e6f3f2",
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
      },
    },
  },
};

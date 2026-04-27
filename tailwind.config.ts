import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#f4f0e8",
          "bg-elevated": "#fffcf7",
          surface: "#ffffff",
          ink: "#0a0d10",
          "ink-muted": "#3a4048",
          "ink-faint": "#5a6270",
          border: "#d9d0c4",
          "border-strong": "#b8ae9e",
          accent: "#0d8b8b",
          "accent-hover": "#0a7070",
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

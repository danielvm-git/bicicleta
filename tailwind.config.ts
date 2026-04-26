import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        db: {
          bg: "var(--db-color-bg)",
          ink: "var(--db-color-ink)",
          accent: "var(--db-color-accent)",
          border: "var(--db-color-border)",
        },
      },
    },
  },
};

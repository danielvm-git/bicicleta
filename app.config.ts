export default defineAppConfig({
  ui: {
    primary: "primary",
    gray: "gray",
    card: {
      rounded: "rounded-none",
      border: "border-2 border-black dark:border-white",
      shadow: "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    },
    button: {
      rounded: "rounded-none",
      default: {
        size: "md",
        variant: "solid",
        color: "black",
      },
    },
    input: {
      rounded: "rounded-none",
      border: "border-2 border-black",
    },
    select: {
      rounded: "rounded-none",
    },
    selectMenu: {
      rounded: "rounded-none",
    },
  },
});

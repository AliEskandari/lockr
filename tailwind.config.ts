import type { Config } from "tailwindcss";
import { tailwindcssOriginSafelist } from "@headlessui-float/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./modals/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Open Sans", "system-ui"],
    },
    extend: {},
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    // ...
  ],
  safelist: [...tailwindcssOriginSafelist],
};
export default config;

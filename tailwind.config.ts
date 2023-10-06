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
        primary: "#4467fb",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-winter":
          "linear-gradient(130deg, #d3dbff, #eff3fb 36%, #eff3fb 68%, #d8f1f5)",
      },
    },
  },
  plugins: [],
};
export default config;

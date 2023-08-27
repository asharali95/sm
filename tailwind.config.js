/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#144D8E",
          200: "#003A9B",
        },
        secondary: {
          100: "#24b524",
          200: "#1e941e",
        },
        tertiary: {
          100: "#9B9B9B",
          200: "#848484",
        },
      },
      screens: {
        xs: "475px",
        xxs: "360px",
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  variants: {
    scrollbar: ["rounded"],
  },
};

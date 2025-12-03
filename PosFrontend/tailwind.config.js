/* eslint-disable global-require */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const appTypography = require("./config/typography");
const appAnimations = require("./config/keyframes");
const { colors, mono } = require("./config/colors");

module.exports = {
  mode: "jit",
  content: [
    "./src/**/**/*.{js,jsx,ts,tsx,css,scss,mdx,md}",
    "./public/**/*.html",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "428px",
      sm: "640px",
      md: "744px",
      lg: "1280px",
      xl: "1366px",
      "2xl": "1440px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        xs: "16px",
        sm: "20px",
        md: "40px",
        lg: "40px",
        xl: "80px",
        "2xl": "80px",
      },
    },
    fontFamily: {
      ...appTypography.fontFamily,
    },
    fontSize: {
      ...appTypography.headings.fontSize,
      ...appTypography.display.fontSize,
      ...appTypography.body.fontSize,
    },
    fontWeight: {
      ...defaultTheme.fontWeight,
      ...appTypography.fontWeight,
    },
    colors: {
      ...colors,
      ...mono,
      // Keep primary mapped to B (Pastel Blue) for backward compatibility
      primary: {
        50: "#F0F6FC",
        100: "#F0F6FC",
        200: "#C5DBEF",
        300: "#C5DBEF",
        400: "#9BC3E3",
        500: "#7BA7D1",
        600: "#5B8AB8",
        700: "#5B8AB8",
        800: "#5B8AB8",
        900: "#5B8AB8",
      },
    },
    extend: {
      ...appAnimations,
      boxShadow: {
        DEFAULT:
          "0px 0px 5px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.15)",
        base: "0px 0px 5px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.15)",
        in: "inset 0px 2px 4px rgba(0, 0, 0, 0.06)",
        md: "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
        sm: "0px 0px 5px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.15)",
        lg: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "input-focus": "0px 0px 0px 1px #A0C4E9",
        "input-focus-error": "0px 0px 0px 1px #F03D00",
        "drawer-footer": "0px -4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

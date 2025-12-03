module.exports = {
  fontSources: ["Google Fonts"],

  fontStack: [
    {
      name: '"Anton", sans-serif',
      cssClass: "text-serif",
      link: "https://fonts.google.com/specimen/Anton",
    },
    {
      name: "Roboto Flex",
      cssClass: "text-sans",
      link: "https://fonts.google.com/specimen/Roboto+Flex",
    },
    {
      name: "Roboto Mono",
      cssClass: "text-mono",
      link: "https://fonts.google.com/specimen/Roboto+Mono",
    },
  ],

  fontFamily: {
    sans: ['"Roboto Flex"', "sans-serif"],
    serif: ['"Roboto Flex"', "serif"],
    heading: ['"Roboto Flex"', "sans-serif"],
    display: ['"Anton"', "sans-serif"],
    mono: ['"Roboto Mono"', "monospace"],
    code: ['"Roboto Mono"', "monospace"],
  },

  fontWeight: {
    100: "100",
    200: "200",
    300: "300",
    400: "400",
    500: "500",
    600: "600",
    700: "700",
    800: "800",
    900: "900",
    bold: "700",
    "extra-bold": "800",
    black: "900",
  },

  display: {
    fontFamily: '"Anton", sans-serif',

    fontSize: {
      "display-h1": [
        "46px",
        {
          lineHeight: "56px",
          letterSpacing: "0.01em",
        },
      ],
      "display-h2": [
        "40px",
        {
          lineHeight: "48px",
          letterSpacing: "0.01em",
        },
      ],
      "display-h1-m": [
        "32px",
        {
          lineHeight: "40px",
          letterSpacing: "0.03em",
        },
      ],
      "display-h2-m": [
        "28px",
        {
          lineHeight: "36px",
          letterSpacing: "0.03em",
        },
      ],
    },
  },

  headings: {
    fontFamily: '"Roboto Flex", sans-serif',

    fontSize: {
      h1: [
        "42px",
        {
          lineHeight: "56px",
          letterSpacing: "-0.02em",
        },
      ],
      h2: [
        "33px",
        {
          lineHeight: "44px",
          letterSpacing: "-0.02em",
        },
      ],
      h3: [
        "24px",
        {
          lineHeight: "32px",
          letterSpacing: "-0.02em",
        },
      ],
      "h1-m": [
        "37px",
        {
          lineHeight: "48px",
          letterSpacing: "-0.02em",
        },
      ],
      "h2-m": [
        "28px",
        {
          lineHeight: "32px",
          letterSpacing: "-0.02em",
        },
      ],
      "h3-m": [
        "19px",
        {
          lineHeight: "24px",
          letterSpacing: "-0.02em",
        },
      ],
    },
  },

  body: {
    fontFamily: ['"Roboto Flex", sans-serif', '"Roboto Mono", monospace'],
    fontSize: {
      base: [
        "16px",
        {
          lineHeight: "24px",
        },
      ],
      sm: [
        "14px",
        {
          lineHeight: "20px",
        },
      ],
      xs: [
        "12px",
        {
          lineHeight: "16px",
        },
      ],
      code: [
        "12px",
        {
          lineHeight: "26px",
        },
      ],
      link: [
        "16px",
        {
          lineHeight: "20px",
        },
      ],
      "display-body": [
        "22px",
        {
          lineHeight: "24px",
        },
      ],
      "display-body-m": [
        "20px",
        {
          lineHeight: "24px",
        },
      ],
    },
  },
};

const pal = {
  B: {
    colorName: "Deep Blue",
    shortName: "B",
    base: "#7BA7D1",
    darkest: "#5B8AB8",
    25: {
      base: "#F0F6FC",
      contrast: "#1D2939",
      description: `- Used for subtle background.`,
      contrastRatio: "1.09",
    },
    200: {
      base: "#C5DBEF",
      contrast: "#344054",
      description: `- Borders paired with deep-blue/25
<br />- Focus ring for primary actions with opacity 50%`,
      contrastRatio: "1.81",
    },
    400: {
      base: "#9BC3E3",
      contrast: "#1D2939",
      description: `- Hover state`,
      contrastRatio: "3.31",
    },
    500: {
      base: "#7BA7D1",
      contrast: "#ffffff",
      description: `- Background for components with primary actions
<br />- Background in footer and header`,
      contrastRatio: "AA 7.92",
    },
    600: {
      base: "#5B8AB8",
      contrast: "#ffffff",
      description: `- Background in footer and header`,
      contrastRatio: "AA 11.63",
    },
  },
  O: {
    colorName: "Orange",
    shortName: "O",
    base: "#F5B47A",
    darkest: "#E89D5E",
    25: {
      base: "#FEF4EB",
      contrast: "#1D2939",
      description: `For use as a primary subtle background color, in components such as Lozenge and Badge backgrounds.`,
      contrastRatio: "1.07",
    },
    200: {
      base: "#FDDBB8",
      contrast: "#1D2939",
      description: `Borders paired with neutral/300
      Focus ring for secondary actions.`,
      contrastRatio: "1.52",
    },
    400: {
      base: "#F8C796",
      contrast: "#1D2939",
      description: `Hover state
      Background color for components like Page and Frame.`,
      contrastRatio: "2.17",
    },
    500: {
      base: "#F5B47A",
      contrast: "#1D2939",
      description: `Background for components with primary actions
      Background in footer and header`,
      contrastRatio: "2.76",
    },
    600: {
      base: "#E89D5E",
      contrast: "#FFFFFF",
      description: `N/A - only for theoretical reference`,
      contrastRatio: "3.39",
    },
  },
  G: {
    colorName: "Green",
    shortName: "G",
    base: "#9BCF88",
    darkest: "#7DB96A",
    25: {
      base: "#F0FAED",
      contrast: "#1D2939",
      description: `Success state
      Subtle background for components like badges and lozenge`,
      contrastRatio: "AA 4.55",
    },
    200: {
      base: "#D7EDCE",
      contrast: "#1D2939",
      description: `Success state
      Subtle background for components like badges and lozenge`,
      contrastRatio: "AA 4.55",
    },
    400: {
      base: "#B9E0A6",
      contrast: "#1D2939",
      description: `N/A - only for theoretical reference`,
      contrastRatio: "AA 4.55",
    },
    500: {
      base: "#9BCF88",
      contrast: "#1D2939",
      description: `Success state
      Prominently used for toast component`,
      contrastRatio: "AA 4.55",
    },
    600: {
      base: "#7DB96A",
      contrast: "#FFFFFF",
      description: `Success state
      Default background for components like badges and lozenge`,
      contrastRatio: "AA 4.55",
    },
  },
  R: {
    colorName: "Red",
    shortName: "R",
    base: "#F29BA8",
    darkest: "#E87789",
    25: {
      base: "#FEF1F3",
      contrast: "#1D2939",
      description: `Danger state
      Subtle background for components like badges and lozenge`,
      contrastRatio: "AA 4.55",
    },
    200: {
      base: "#FAD4DC",
      contrast: "#1D2939",
      description: `Danger state
      Subtle background for components like badges and lozenge`,
      contrastRatio: "AA 4.55",
    },
    400: {
      base: "#F6B8C4",
      contrast: "#1D2939",
      description: `N/A - only for theoretical reference`,
      contrastRatio: "AA 4.55",
    },
    500: {
      base: "#F29BA8",
      contrast: "#1D2939",
      description: `Danger state
      Prominently used for toast component`,
      contrastRatio: "AA 4.55",
    },
    600: {
      base: "#E87789",
      contrast: "#FFFFFF",
      description: `Danger state
      Default background for components like badges and lozenge`,
      contrastRatio: "AA 4.55",
    },
  },
  Y: {
    colorName: "Yellow",
    shortName: "Y",
    base: "#F5D98A",
    darkest: "#ECC96B",
    25: {
      base: "#FFFCF0",
      contrast: "#1D2939",
      description: `Warning state
      Subtle background for components like badges and lozenge`,
      contrastRatio: "AA 4.55",
    },
    200: {
      base: "#FBF0C8",
      contrast: "#1D2939",
      description: `Warning state
      Subtle background for components like badges and lozenge`,
      contrastRatio: "AA 4.55",
    },
    400: {
      base: "#F8E4A9",
      contrast: "#1D2939",
      description: `N/A - only for theoretical reference`,
      contrastRatio: "AA 4.55",
    },
    500: {
      base: "#F5D98A",
      contrast: "#1D2939",
      description: `Warning state
      Prominently used for toast component`,
      contrastRatio: "AA 4.55",
    },
    600: {
      base: "#ECC96B",
      contrast: "#1D2939",
      description: `Warning state
      Default background for components like badges and lozenge`,
      contrastRatio: "AA 4.55",
    },
  },
  N: {
    colorName: "Neutral",
    shortName: "N",
    base: "#3d3d3c",
    darkest: "#272724",
    25: {
      base: "#f7f7f6",
      contrast: "#1D2939",
      description: `- Used sometimes as subtle background.`,
      contrastRatio: "AA 4.55",
    },
    50: {
      base: "#e4e4e3",
      contrast: "#101828",
      description: `- Used prominently as subtle background.`,
      contrastRatio: "AA 4.55",
    },
    100: {
      base: "#D9D9D5",
      contrast: "#1D2939",
      description: `N/A - only for theoretical reference`,
      contrastRatio: "AA 4.55",
    },
    200: {
      base: "#c0c0bf",
      contrast: "#1D2939",
      description: `Used as background for disabled state`,
      contrastRatio: "AA 4.55",
    },
    300: {
      base: "#a6a6a6",
      contrast: "#1D2939",
      description: `Used as border in components - paired with neutral/50`,
      contrastRatio: "AA 4.55",
    },
    400: {
      base: "#8d8d8d",
      contrast: "#FFFFFF",
      description: `N/A - only for theoretical reference`,
      contrastRatio: "AA 4.55",
    },
    500: {
      base: "#747474",
      contrast: "#FFFFFF",
      description: `Used for sub-texts in body`,
      contrastRatio: "AA 4.55",
    },
    600: {
      base: "#5a5a5a",
      contrast: "#FFFFFF",
      description: `N/A - only for theoretical reference`,
      contrastRatio: "AA 4.55",
    },
    700: {
      base: "#3d3d3c",
      contrast: "#FFFFFF",
      description: `Used for main texts in body`,
      contrastRatio: "AA 4.55",
    },
    800: {
      base: "#272724",
      contrast: "#FFFFFF",
      description: `Used for important texts like headings in components`,
      contrastRatio: "AA 4.55",
    },
  },
};

const tailwindMap = Object.entries(pal).map(([key, value]) => {
  const shortName = key;
  const { base, darkest, colorName, shortName: sn, ...rest } = value;

  const weights = Object.entries(rest).map(([wKey, wValue]) => {
    const DEFAULT = {
      [wKey]: wValue.base,
      [`${[wKey]}-contrast`]: wValue.contrast,
    };
    return DEFAULT;
  });

  const prepMap = weights.map((color) => color);
  const colorMap = Object.assign({}, ...prepMap);

  const prepObject = {
    [shortName]: {
      base,
      darkest,
      ...colorMap,
    },
  };

  return prepObject;
});

const documentMap = Object.entries(pal).map(([key, value]) => {
  const shortName = key;
  const { base, darkest, colorName, shortName: sn, ...restValues } = value;

  const colors = Object.entries(restValues).map(([wKey, wValue]) => {
    const DEFAULT = {
      base: wValue.base,
      colorName,
      contrast: wValue.contrast,
      contrastRatio: wValue.contrastRatio,
      description: wValue.description,
      shortName,
      weight: wKey,
    };
    return DEFAULT;
  });

  return colors;
});

const documentation = documentMap.map((color) => {
  const prepObj = {
    [color[0].shortName]: color,
  };
  return prepObj;
});

module.exports = {
  colors: Object.assign({}, ...tailwindMap),
  mono: {
    white: "#ffffff",
    black: "#000000",
    aqua: "#76C3C2",
  },
  documentation: Object.assign({}, ...documentation),
};

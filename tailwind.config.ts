const vignetteZIndex = 10;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      gray: {
        "10": "var(--gray-10)",
        "11": "var(--gray-11)",
        "12": "var(--gray-12)",
        "00": "var(--gray-00)",
        "01": "var(--gray-01)",
        "02": "var(--gray-02)",
        "03": "var(--gray-03)",
        "04": "var(--gray-04)",
        "05": "var(--gray-05)",
        "06": "var(--gray-06)",
        "07": "var(--gray-07)",
        "08": "var(--gray-08)",
        "09": "var(--gray-09)",
        A01: "var(--gray-A01)",
        A02: "var(--gray-A02)",
        A03: "var(--gray-A03)",
        A04: "var(--gray-A04)",
        A05: "var(--gray-A05)",
        A06: "var(--gray-A06)",
        A07: "var(--gray-A07)",
        A08: "var(--gray-A08)",
        A09: "var(--gray-A09)",
        A10: "var(--gray-A10)",
        A11: "var(--gray-A11)",
        A12: "var(--gray-A12)",
      },
      white: "hsl(0 0% 100%)",
      accent: "var(--gray-12)",
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-ibm-plex-serif)"],
        sans: ["var(--font-ibm-plex-serif)"],
        mono: ["var(--font-geist-mono)"],
      },
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
        "14": "repeat(14, minmax(0, 1fr))",
        "15": "repeat(15, minmax(0, 1fr))",
        "16": "repeat(16, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
      },
      gridColumnStart: {
        "13": "13",
        "14": "14",
        "15": "15",
        "16": "16",
        "17": "17",
      },
      gridColumnEnd: {
        "13": "13",
        "14": "14",
        "15": "15",
        "16": "16",
        "17": "17",
      },
      keyframes: {
        fadeBlueOut: {
          "0%": {
            backgroundColor: "#0E61FE",
            transform: "scale(1)",
          },
          "100%": {
            backgroundColor: "var(--gray-04)",
            transform: "scale(0.4)",
          },
        },
        fade: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        fadeOut: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
        scaleInSlideDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px) scale(0)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        scaleInSlideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(5px) scale(0)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        scaleOutSlideDown: {
          "0%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-5px) scale(0)",
          },
        },
        scaleOutSlideUp: {
          "0%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(5px) scale(0)",
          },
        },
      },
      animation: {
        fadeBlueOut: "fadeBlueOut 1500ms cubic-bezier(0.2, 0, 0.38, 0.9)",
        fade: "fade 550ms cubic-bezier(0, 0, 0.3, 1)",
        fadeOut: "fadeOut 550ms cubic-bezier(0, 0, 0.3, 1)",
        scaleInSlideDown: "scaleInSlideDown 110ms ease-out",
        scaleInSlideUp: "scaleInSlideUp 110ms cubic-bezier(0, 0, 0.38, 0.9)",
        scaleOutSlideDown: "scaleOutSlideDown 110ms linear",
        scaleOutSlideUp: "scaleOutSlideUp 110ms cubic-bezier(0.2, 0, 1, 0.9)",
      },
      transitionTimingFunction: {
        "productive-standard": "cubic-bezier(0.2, 0, 0.38, 0.9)",
        "productive-entrance": "cubic-bezier(0, 0, 0.38, 0.9)",
        "productive-exit": "cubic-bezier(0.2, 0, 1, 0.9)",
        "expressive-standard": "cubic-bezier(0.4, 0.14, 0.3, 1)",
        "expressive-entrance": "cubic-bezier(0, 0, 0.3, 1)",
        "expressive-exit": "cubic-bezier(0.4, 0.14, 1, 1)",
      },
      transitionDuration: {
        "fast-01": "70ms",
        "fast-02": "110ms",
        "moderate-01": "150ms",
        "moderate-02": "240ms",
        "slow-01": "400ms",
        "slow-02": "700ms",
      },
      borderRadius: {
        inherit: "inherit",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      dropShadow: {
        input:
          "`\n        0px 1px 0px -1px var(--tw-shadow-color),\n        0px 1px 1px -1px var(--tw-shadow-color),\n        0px 1px 2px -1px var(--tw-shadow-color),\n        0px 2px 4px -2px var(--tw-shadow-color),\n        0px 3px 6px -3px var(--tw-shadow-color)\n      `",
        highlight:
          "`\n        inset 0px 0px 0px 1px var(--tw-shadow-color),\n        inset 0px 1px 0px var(--tw-shadow-color)\n      `",
        "faux-border":
          "`\n            inset 0px 0px 0px 1px var(--tw-shadow-color),\n        `",
      },
      boxShadow: {
        input:
          "`\n            0px 1px 0px -1px var(--tw-shadow-color),\n            0px 1px 1px -1px var(--tw-shadow-color),\n            0px 1px 2px -1px var(--tw-shadow-color),\n            0px 2px 4px -2px var(--tw-shadow-color),\n            0px 3px 6px -3px var(--tw-shadow-color)\n          `",
        highlight:
          "`\n            inset 0px 0px 0px 1px var(--tw-shadow-color),\n            inset 0px 1px 0px var(--tw-shadow-color)\n          `",
        "faux-border":
          "`\n            inset 0px 0px 0px 1px var(--tw-shadow-color),\n        `",
      },
      zIndex: {
        vignette: vignetteZIndex,
        aboveVignette: vignetteZIndex + 1,
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
  safelist: [
    {
      pattern: /grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16)/,
      variants: ["lg", "md"],
    },
  ],
  plugins: [
    require("tailwindcss-radix")(),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
    // @ts-ignore-next-line - This is a custom plugin
    function ({ addBase, theme }) {
      // @ts-ignore-next-line - This is a custom plugin
      function extractColorVars(colorObj, colorGroup = "") {
        // @ts-ignore-next-line - This is a custom plugin
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];
          const cssVariable =
            colorKey === "DEFAULT"
              ? `--color${colorGroup}`
              : `--color${colorGroup}-${colorKey}`;
          // @ts-ignore-next-line - This is a custom plugin
          const newVars =
            typeof value === "string"
              ? { [cssVariable]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    },
  ],
};

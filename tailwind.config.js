const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper stack — the cream ground of the references.
        paper: {
          DEFAULT: "#FBF4E6",
          50: "#FFFCF6",
          100: "#F6EBD6",
          200: "#EFDFC2",
          300: "#E3CDA6",
        },
        // Oxblood — the brand primary, lifted from the red editorial refs.
        oxblood: {
          DEFAULT: "#7B1526",
          50: "#F7E3E5",
          400: "#9C2233",
          600: "#7B1526",
          800: "#54101C",
          900: "#3A0B13",
        },
        // Roasted browns — hero imagery, dark sections.
        espresso: {
          DEFAULT: "#1C1210",
          700: "#3A241C",
          800: "#2A1813",
          900: "#140C0A",
        },
        // Clay/amber accent — the candlelight warmth.
        clay: {
          DEFAULT: "#C08A4E",
          400: "#D6A469",
          600: "#A06E39",
        },
        ink: {
          DEFAULT: "#1C1210",
          muted: "#6B5B4E",
          faint: "#9C8B7C",
        },
      },
      fontFamily: {
        // Editorial didone-ish serif — headings and italic accents.
        display: ["var(--font-display)", "Georgia", "serif"],
        // Tight neo-grotesk — oversized wordmarks, UI, body.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        // Uppercase micro-labels and specs.
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Fluid display ramp for the full-bleed wordmark treatments.
        "display-sm": ["clamp(2.25rem, 6vw, 4rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(3rem, 9vw, 7rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(4rem, 16vw, 15rem)", { lineHeight: "0.82", letterSpacing: "-0.045em" }],
        micro: ["0.625rem", { lineHeight: "1.2", letterSpacing: "0.14em" }],
        spec: ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.12em" }],
      },
      letterSpacing: {
        micro: "0.14em",
        wider2: "0.22em",
      },
      maxWidth: {
        shell: "96rem",
        prose2: "34rem",
      },
      borderColor: {
        DEFAULT: "rgba(28, 18, 16, 0.14)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        blink: {
          "0%": { opacity: 0.2 },
          "20%": { opacity: 1 },
          "100%": { opacity: 0.2 },
        },
        riseIn: {
          from: { opacity: 0, transform: "translateY(1.25rem)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        slowZoom: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.08)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        blink: "blink 1.4s both infinite",
        riseIn: "riseIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        marquee: "marquee 38s linear infinite",
        slowZoom: "slowZoom 18s ease-out both",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        }
      );
    }),
  ],
};

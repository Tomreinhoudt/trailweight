import type { Config } from "tailwindcss";

// Colors are defined as CSS variables (space-separated RGB) in globals.css
// The <alpha-value> placeholder lets Tailwind opacity modifiers work: bg-volt/40
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        field: {
          bg:             v("--color-field-bg"),
          surface:        v("--color-field-surface"),
          card:           v("--color-field-card"),
          elevated:       v("--color-field-elevated"),
          border:         v("--color-field-border"),
          "border-strong": v("--color-field-border-strong"),
        },
        volt: {
          DEFAULT: v("--color-volt"),
          dim:     v("--color-volt-dim"),
          muted:   v("--color-volt-muted"),
        },
        ember: {
          DEFAULT: v("--color-ember"),
          muted:   v("--color-ember-muted"),
        },
        ink: {
          1: v("--color-ink-1"),
          2: v("--color-ink-2"),
          3: v("--color-ink-3"),
        },
      },
      fontFamily: {
        display: ["var(--font-chakra)", "monospace"],
        mono:    ["var(--font-jetbrains)", "monospace"],
        sans:    ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

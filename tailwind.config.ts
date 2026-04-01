import type { Config } from "tailwindcss";

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
          bg: "#0C0F0D",
          surface: "#111712",
          card: "#172019",
          elevated: "#1D2A21",
          border: "#253228",
          "border-strong": "#2E4036",
        },
        volt: {
          DEFAULT: "#C8ED40",
          dim: "#9BBB2C",
          muted: "#1A2D08",
        },
        ember: {
          DEFAULT: "#F25C20",
          muted: "#351508",
        },
        ink: {
          1: "#E4EDE0",
          2: "#6A8C6C",
          3: "#3A5040",
        },
      },
      fontFamily: {
        display: ["var(--font-chakra)", "monospace"],
        mono: ["var(--font-jetbrains)", "monospace"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

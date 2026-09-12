/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0a0503",
        panel: "#150908",
        "panel-2": "#1c0d0a",
        line: "#3a1512",
        "line-dim": "#241009",
        accent: {
          DEFAULT: "#ff1e1e",
          dim: "#7a1512",
          glow: "#ff5540"
        },
        ok: "#39ff6a",
        warn: "#ffb020",
        ink: {
          DEFAULT: "#f3e8e4",
          dim: "#8f7570"
        }
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
        display: ["'Chakra Petch'", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};
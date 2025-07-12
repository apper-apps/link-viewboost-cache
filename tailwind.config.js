/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF0000",
        secondary: "#1a1a1a",
        accent: "#00F0FF",
        surface: "#2a2a2a",
        background: "#0f0f0f",
        success: "#00FF88",
        warning: "#FFB800",
        error: "#FF3366",
        info: "#00B4FF",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "progress": "progress 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(255, 0, 0, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 0, 0, 0.8)" },
        },
        "progress": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        }
      }
    },
  },
  plugins: [],
}
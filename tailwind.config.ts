import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Soft, feminine, romantic palette
        pinkSoft: "#FFB6C1",
        pinkHot: "#FF69B4",
        lavender: "#E6E6FA",
        plum: "#DDA0DD",
        roseGold: "#B76E79",
        darkRose: "#4A0E2E",
      },
      fontFamily: {
        script: ['"Dancing Script"', "cursive"],
        display: ['"Playfair Display"', "serif"],
        body: ['"Poppins"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(183, 110, 121, 0.35)",
        glow: "0 0 30px -5px rgba(255, 105, 180, 0.5)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(255,105,180,0.5)" },
          "50%": { transform: "scale(1.04)", boxShadow: "0 0 0 12px rgba(255,105,180,0)" },
        },
        floatUp: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(-110vh) rotate(360deg)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-8px)" },
          "40%, 80%": { transform: "translateX(8px)" },
        },
        // Slow drifting zoom/pan — the "Ken Burns" documentary effect.
        kenburns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "50%": { transform: "scale(1.12) translate(-1.5%, -1.5%)" },
          "100%": { transform: "scale(1.06) translate(1.5%, 1%)" },
        },
        kenburnsAlt: {
          "0%": { transform: "scale(1.08) translate(1%, -1%)" },
          "50%": { transform: "scale(1) translate(0, 1.5%)" },
          "100%": { transform: "scale(1.12) translate(-1.5%, 0)" },
        },
        fadeSlide: {
          "0%": { opacity: "0", transform: "scale(1.04)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        pulseSoft: "pulseSoft 2s ease-in-out infinite",
        floatUp: "floatUp linear infinite",
        shake: "shake 0.5s ease-in-out",
        kenburns: "kenburns 18s ease-in-out infinite alternate",
        kenburnsAlt: "kenburnsAlt 22s ease-in-out infinite alternate",
        fadeSlide: "fadeSlide 1s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#031C45",
        foreground: "#FCFDFE",
        procap: {
          navy: "#031C45",        // Fondo profundo / esquinas
          glow: "#073374",        // Resplandor central / azul medio
          slate: "#393945",       // Sombra relieve 3D
          pure: "#FFFFFF",        // Highlights
          silver: "#FCFDFE",      // Texto y logotipo
          cyan: "#38bdf8",        // Acento tech / contraste
          emerald: "#25D366",     // WhatsApp
        },
        brand: {
          card: "rgba(7, 51, 116, 0.35)",
          cardHover: "rgba(7, 51, 116, 0.55)",
          border: "rgba(56, 189, 248, 0.2)",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        heading: ["var(--font-syne)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        xs: "480px",
        sm: "767px",
        md: "979px",
        lg: "1200px",
        xl: "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          100: "#91C8E4",
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        dark: {
          100: "#202020",
          110: "#77172E",
          120: "#692B17",
          130: "#7C4A03",
          137: "#757575",
          138: "#D4D4D4",
          139: "#383838",
          140: "#264D3B",
          150: "#0C625D",
          160: "#256377",
          170: "#284255",
          180: "#472E5B",
          190: "#6C394F",
          200: "#191919",
          210: "#4B443A",
          220: "#232427",
          230: "#FAAFA8",
          240: "#F39F76",
          250: "#000000",
          260: "#FFF8B8",
          270: "#E2F6D3",
          280: "#B4DDD3",
          290: "#D4E4ED",
          300: "#323232",
          310: "#AECCDC",
          320: "#D3BFDB",
          330: "#F6E2DD",
          340: "#E9E3D4",
          360: "#EFEFF1",
          400: "#FFFFFF",
          450: "#F5F5F8",
          500: "#5E5E5E",
          550: "#00A6FF",
          600: "#18090A",
          650: "#280000",
          700: "#850000",
          750: "#450000",
          800: "#23000A",
          850: "#61677A",
          900: "#0A0909",
          950: "#61677A",
        },
        light: {
          100: "#FFFFFF",
          200: "#666666",
          300: "#FCFFE7",
          400: "#BAD7E9",
          500: "#2B3467",
          600: "#EB455F",
        },
        border: {
          100: "#808080",
        },
        line: {
          100: "#D9D9D9",
        },
        other: {
          "alert-info": "#0071F9",
          "alert-success": "#34C759",
          "alert-error": "#E01F27",
          "alert-warning": "#F1C218",
        },
      },
      screens: {
        xs: "420px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: 0,
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: 0,
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
    // require("@tailwindcss/line-clamp"),
  ],
};

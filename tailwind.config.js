/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2e2b61",
          100: "#d6d4ec",
          200: "#acaada",
          300: "#837fc7",
          400: "#5a55b4",
          500: "#49449c",
          600: "#3c3880",
          700: "#2e2b61",
          800: "#211f47",
          900: "#14132b" 
        },
        secondary: {
          DEFAULT: '#758ECD',
          100: '#F0F3FA', 
          200: '#C3CEE9',
          300: '#A5B5DF',
          400: '#758ECD',
          500: '#4C6CBE',
          600: '#3B59A5',
          700: '#2B4178',
          800: '#20315A',
          900: '#16203C'
        },
        foreground: "#14132b",
        background: {
          DEFAULT: "#f5f5f5",
          100: '#ffffff',
          200: '#f5f5f5',
          300: '#e0e0e0', 
          400: '#cccccc',
          500: '#b8b8b8',
          600: '#a3a3a3',
          700: '#8f8f8f',
          800: '#707070',
          900: '#474747',
        },
        border: "#14132b",
        accent: {
          DEFAULT: "#758ECD"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#FFFFFF', // White
          dark: '#1A1A1A', // Very dark gray (almost black)
        },
        surface: {
          light: '#F5F5F5', // Light gray
          dark: '#2A2A2A', // Dark gray
        },
        primary: {
          500: '#E03A3E', // Chicago Red
          600: '#C8353A', // Darker red
          700: '#B03035', // Even darker red
        },
        text: {
          light: {
            primary: '#1A1A1A', // Very dark gray (almost black)
            secondary: '#666666', // Dark gray
          },
          dark: {
            primary: '#FFFFFF', // White
            secondary: '#B3B3B3', // Light gray
          },
        },
        accent: {
          light: '#000000', // Black (for light mode)
          dark: '#E03A3E', // Chicago Red (for dark mode)
        },
      },
      minHeight: {
        screen: '100vh',
      },
    },
  },
  plugins: [],
}


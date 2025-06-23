/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14532d', // dark green
          light: '#166534',
          dark: '#0c2e15',
        },
        accent: '#22c55e', // a nice green accent
        background: {
          light: '#f5f5f4',
          dark: '#0c2e15',
        },
        text: {
          light: '#1a1a1a',
          dark: '#e5e5e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
} 
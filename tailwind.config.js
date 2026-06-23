/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef6f0',
          100: '#fde8d8',
          200: '#fad0b0',
          300: '#f7b888',
          400: '#f5a070',
          500: '#f4a261', // Coral/Orange - matches CSS var --primary
          600: '#d98a4f',
          700: '#bf7240',
          800: '#a45a31',
          900: '#8a4222',
        },
        secondary: {
          50: '#f9f0f0',
          100: '#f0d6d7',
          200: '#e2adb0',
          300: '#d48589',
          400: '#c66c70',
          500: '#c1666b', // Terracotta - matches CSS var --secondary
          600: '#a8555a',
          700: '#8f4449',
          800: '#763338',
          900: '#5d2227',
        },
        accent: {
          50: '#fdf8ed',
          100: '#f9edcc',
          200: '#f3db99',
          300: '#edc966',
          400: '#e9c46a', // Warm sand
          500: '#e9c46a', // Warm sand - matches CSS var --accent
          600: '#d4b05a',
          700: '#bf9c4a',
          800: '#aa883a',
          900: '#95742a',
        },
        dark: {
          bg: '#0a0a0f',    // Deep black with blue tint
          card: '#12121a',   // Card background
          border: '#2a2a3a', // Border color
        },
        'dark-bg': '#0a0a0f', // Dark background base color
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 162, 97, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(244, 162, 97, 0.4)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        blink: 'blink 1s step-end infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
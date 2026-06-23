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
          50: '#1a1a25',
          100: '#2a2a3a',
          200: '#3a3a4f',
          300: '#6366f1',
          400: '#818cf8',
          500: '#6366f1', // Indigo accent
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          500: '#8888a0',
          600: '#6b6b82',
        },
        accent: {
          400: '#8888a0',
          500: '#6366f1', // Indigo accent
          600: '#4f46e5',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' },
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

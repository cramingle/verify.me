/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/src/**/*.{js,jsx,ts,tsx}",
    "./frontend/public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#1E3A8A',
        'crisp-white': '#FFFFFF',
        'teal': '#14B8A6',
        'subtle-gray': '#D1D5DB',
        'error-red': '#EF4444',
        'success-green': '#10B981',
        'gradient-start': '#3B82F6',
        'gradient-end': '#14B8A6'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'shake': 'shake 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        },
      },
    },
  },
  plugins: [],
} 
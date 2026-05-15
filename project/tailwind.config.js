/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f5fa',
          100: '#dce7f5',
          200: '#c0d4eb',
          300: '#94b7dc',
          400: '#6391c9',
          500: '#4271b5',
          600: '#345a9a',
          700: '#2c497e',
          800: '#273f69',
          900: '#0d1d42',
        },
        gold: {
          50: '#fefbf3',
          100: '#fbf3d5',
          200: '#f5e4ad',
          300: '#eed077',
          400: '#e5b747',
          500: '#dea227',
          600: '#cd881d',
          700: '#aa681a',
          800: '#89521c',
          900: '#70451b',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'fade-in-delayed': 'fadeIn 1s ease-in-out 0.3s forwards',
        'fade-in-delayed-more': 'fadeIn 1s ease-in-out 0.6s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '420px',
      },
      colors: {
        'bg-primary': '#0A0A0C',
        'bg-secondary': '#141417',
        'accent-volt': '#CCFF00',
        'accent-orange': '#FF3B00',
        'text-main': '#F4F4F6',
        'text-muted': '#8E8E93',
        'border-grid': '#2A2A30',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      boxShadow: {
        'volt-glow': '0 0 25px -2px rgba(204, 255, 0, 0.45)',
        'orange-glow': '0 0 25px -2px rgba(255, 59, 0, 0.45)',
      },
    },
  },
  plugins: [],
};

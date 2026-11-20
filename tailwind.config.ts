import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['IBM Plex Sans Arabic', 'system-ui', 'sans-serif'] },
      colors: {
        ink: '#2b2457',
        night: { 950: '#0b0a2a', 900: '#141244', 800: '#1f1b5e', 700: '#2d2880' },
        star: { 300: '#ffe08a', 400: '#ffd04d', 500: '#f6b81a', 600: '#a8690a' },
        aqua: { 300: '#7ff0e0', 400: '#3fdcc8', 500: '#14b8a6', 600: '#0b7f74' },
        rose: { 300: '#ffb3d1', 400: '#ff86b5', 500: '#f0569a', 600: '#c22a6c' },
        sky2: { 300: '#9ecbff', 400: '#6aa8ff', 600: '#2a62c9' },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,.08), 0 10px 30px -10px rgba(255,208,77,.45)',
        card3d: '0 1px 0 #fff inset, 0 -5px 0 rgba(43,36,87,.06) inset, 0 18px 36px -20px rgba(43,36,87,.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;

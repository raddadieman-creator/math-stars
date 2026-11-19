import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Tajawal', 'IBM Plex Sans Arabic', 'system-ui', 'sans-serif'] },
      colors: {
        night: { 950: '#0b0a2a', 900: '#141244', 800: '#1f1b5e', 700: '#2d2880' },
        star: { 300: '#ffe08a', 400: '#ffd04d', 500: '#f6b81a' },
        aqua: { 300: '#7ff0e0', 400: '#3fdcc8', 500: '#14b8a6' },
        rose: { 300: '#ffb3d1', 400: '#ff86b5', 500: '#f0569a' },
        sky2: { 300: '#9ecbff', 400: '#6aa8ff' },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,.08), 0 10px 30px -10px rgba(255,208,77,.45)',
        card3d: '0 1px 0 rgba(255,255,255,.15) inset, 0 -6px 0 rgba(0,0,0,.25) inset, 0 18px 40px -18px rgba(0,0,0,.7)',
      },
    },
  },
  plugins: [],
} satisfies Config;

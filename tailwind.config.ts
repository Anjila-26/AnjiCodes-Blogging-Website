import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'vibrant-accent': '#FF6B6B',
        'background-light': '#f7f7f7',
        'background-dark': '#191919',
        'card-light': '#D8E4F4',
        'card-dark': '#2a1a3a',
        'text-light': '#141118',
        'text-dark': '#e0e0e0',
        'subtext-light': '#756189',
        'subtext-dark': '#a092b0',
        'muted-pastel-1': '#F4E8D1',
        'muted-pastel-2': '#D8BFD8',
        'muted-pastel-3': '#B0E0E6',
        'code-bg-light': '#F0EBE8',
        'code-bg-dark': '#2a2135',
        'subtle-text-light': '#888888',
        'subtle-text-dark': '#a0a0a0',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
      transitionDuration: {
        '400': '400ms',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

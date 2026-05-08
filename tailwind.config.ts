import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10202f',
        mint: '#0f766e',
        coral: '#f97361',
        gold: '#f5b942',
        skyglass: '#e0f2fe'
      },
      boxShadow: {
        panel: '0 18px 50px rgba(16, 32, 47, 0.12)'
      }
    }
  },
  plugins: []
} satisfies Config;

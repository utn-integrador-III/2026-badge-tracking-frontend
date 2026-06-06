import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './features/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          500: '#2563eb',
          700: '#1d4ed8',
          950: '#172554'
        }
      },
      borderRadius: {
        badge: '1.25rem'
      }
    }
  },
  plugins: []
};

export default config;

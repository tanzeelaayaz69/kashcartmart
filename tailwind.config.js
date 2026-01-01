/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#2e7d32', // Success / Stock Available
          600: '#1b5e20',
          700: '#144a18',
          800: '#0d3310',
          900: '#061d08',
        },
        copper: {
          50: '#fff3e0',
          500: '#b87333', // Revenue & Profit
          600: '#a05f2c',
          700: '#8a4b20',
        },
        amber: {
          500: '#f59e0b', // Low Stock
        },
        danger: {
          500: '#ef4444', // Out of Stock
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

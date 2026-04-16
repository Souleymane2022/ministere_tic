/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sht: {
          primary: '#1A2B3C',
          'primary-light': '#2C4056',
          'primary-dark': '#0F1A27',
          secondary: '#2E7D32',
          'secondary-light': '#4CAF50',
          accent: '#F57F17',
          'accent-light': '#FFA726',
          bg: '#F5F7FA',
          sidebar: '#1A2B3C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(26, 43, 60, 0.06)',
        card: '0 4px 12px 0 rgba(26, 43, 60, 0.08)',
      },
    },
  },
  plugins: [],
};

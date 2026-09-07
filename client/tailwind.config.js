/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF5ED',
          100: '#FFE6D5',
          200: '#FFC8A8',
          300: '#FFA470',
          400: '#FF8C42',
          500: '#FF6B00', // Primary Accent
          600: '#E05A00',
          700: '#B84500',
          800: '#913500',
          900: '#752A00',
        },
        dark: {
          sidebar: '#111827',
          bg: '#0B0F19',
          card: '#1F2937',
          border: '#374151',
          hover: '#1F293D'
        },
        light: {
          bg: '#F8F9FA',
          card: '#FFFFFF',
          border: '#E5E7EB',
          sidebar: '#111827'
        }
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px'
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'brand': '0 8px 24px -4px rgba(255, 107, 0, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)'
      }
    },
  },
  plugins: [],
}

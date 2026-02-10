/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#1E293B',
          100: '#0F172A',
          900: '#0F172A',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          500: '#06B6D4',
          600: '#0891B2',
        },
        status: {
          good: '#10B981',
          normal: '#3B82F6',
          caution: '#F59E0B',
          danger: '#EF4444',
        },
      },
    },
  },
  plugins: [],
}

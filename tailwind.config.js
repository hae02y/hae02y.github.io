/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx,css}',
  ],
  theme: {
    mode: 'jit', // JIT 모드 활성화
    extend: {
      colors: {
        primary: '#2d3748',
        secondary: '#718096',
        accent: '#3182ce',
      },
    },
  },
  plugins: [],
}


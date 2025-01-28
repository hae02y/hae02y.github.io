/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx,css,html}',
  ],
  darkMode: ['class', '[data-theme="dark"]'], // Docusaurus의 data-theme 속성을 사용
  theme: {
    mode: 'jit', // JIT 모드 활성화
    extend: {
      fontFamily: {
        'custom': ['Pretendard', 'Cera Round Pro', 'sans-serif'],
      },
      colors: {
        primary: '#2d3748',
        secondary: '#718096',
        accent: '#3182ce',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}



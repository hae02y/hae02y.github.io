/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx,css}',
  ],
  darkMode: 'class', // 다크 모드 클래스를 사용할 수 있도록 설정
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
}


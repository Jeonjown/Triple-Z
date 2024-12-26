/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        rotateLeftSlowly: 'rotateLeftSlowly .3s linear infinite',
        rotateRightSlowly: 'rotateRightSlowly .3s linear infinite',

      },
      keyframes: {
        rotateLeftSlowly: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        rotateRightSlowly: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        aesthetic: '0 3px 10px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        primary: '#fffef9',
        secondary: '#7b4f41',
        accent: '#7B4D35',
        background: '#FFF',
        text: '#363636',
        text_secondary: '#797979',
        icon: '#3D2311',
      },
      fontSize: {
        sm: '0.750rem',
        base: '1rem',
        xl: '1.333rem',
        '2xl': '1.777rem',
        '3xl': '2.369rem',
        '4xl': '3.158rem',
        '5xl': '4.210rem',
      },
      fontFamily: {
        heading: 'Playfair Display',
        body: 'Raleway',
      },
      fontWeight: {
        normal: '400',
        bold: '700',
      },
    },
  },
  plugins: [],
};
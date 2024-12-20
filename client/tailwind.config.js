/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}","./index.html",
  ],
  theme: {
    dark: 'class',
    screens:{
      'xm' : "340px",
      'sm' : "570px",
      'md' : "768px",
      'lg' : '1280px',
      'xl' : "1440px",
      '2xl' : '1600px',
    },
    backgroundSize: {
      '200': '200% auto', // Custom size for gradient animation
    },
    backgroundPosition: {
      'start': '0% 92%',
      'middle': '100% 9%',
      'end': '0% 92%',
    },
    animation: {
      'gradientMove': 'gradientMove 3.5s ease-in-out infinite',
      'gradient': 'gradientAnimation 3.5s ease-in-out  infinite',
      'bounce': 'bounce 1s infinite',
    },
    keyframes: {
      gradientMove: {
        '0%': { backgroundPosition: '0% 92%' },
        '50%': { backgroundPosition: '100% 9%' },
        '75%': { backgroundPosition: '0% 92%' },
        '100%': { backgroundPosition: '100% 9%' },
      },
      gradientAnimation: {
        '0%': {
          background: 'linear-gradient(to right, #0095da, #00c6ff)',
          boxShadow: '0 0 10px #0095da',
        },
        '50%': {
          background: 'linear-gradient(to right, #00c6ff, #0095da)',
          boxShadow: '0 0 20px #00c6ff',
        },
        '75%': {
          background: 'linear-gradient(to right, #00c6ff, #0095da)',
          boxShadow: '0 0 10px #0095da',
        },
        '100%': {
          background: 'linear-gradient(to right, #0095da, #00c6ff)',
          boxShadow: '0 0 20px #0095da',
        },
      },
    },
    
    extend: {},
  },
  plugins: [],
}


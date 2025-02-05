import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      animation: {
        moving_text_colour: "moving_text_colour 6s ease-in-out infinite alternate",
        moving_bg: 'moving_bg 200s linear infinite',
        'border-spin': 'border-spin linear infinite', 
        floating: "floating 30s linear infinite"
      },


      backgroundImage: {
        logo: "linear-gradient(45deg, #60A5FA, #8B5CF6, #EC4899, #FACC15,#60A5FA, #8B5CF6, #EC4899, #FACC15)",
      },

      keyframes: {
        moving_text_colour: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },

          moving_bg: {
            '0%': { backgroundPosition: '0% 0%' },
            '100%': { backgroundPosition: '100% 0%' },
          }
        },

        floating: {
          '0%': { transform: 'translate(0px, -5px) rotateX(0deg) rotateY(0deg)' },
          '5%': { transform: 'translate(-3px, -5.5px) rotateX(-0.35deg) rotateY(-0.55deg)' },
          '10%': { transform: 'translate(-9px, -6.15px) rotateX(-1.1deg) rotateY(-1.23deg)' },
          '13%': { transform: 'translate(-12px, -5.5px) rotateX(-1.9deg) rotateY(-1.34deg)' },
          //Top Left
          '20%': { transform: 'translate(-10px, -7px) rotateX(-2.5deg) rotateY(-1.5deg)' }, 
          '25%': { transform: 'translate(-6px, -5px) rotateX(-1.75deg) rotateY(-0.65deg)' },
          '30%': { transform: 'translate(-4px, -1px) rotateX(0.45deg) rotateY(-0.45deg)' },
          '35%': { transform: 'translate(-7px, 4px) rotateX(1.85deg) rotateY(-1.5deg)' },
          //Bottom Left
          '40%': { transform: 'translate(-10px, 7px) rotateX(2.5deg) rotateY(-1.5deg)' },  /* Bottom-left tilt */
          '60%': { transform: 'translate(10px, 7px) rotateX(2.5deg) rotateY(1.5deg)' },   /* Bottom-right tilt */
          '80%': { transform: 'translate(10px, -7px) rotateX(-2.5deg) rotateY(1.5deg)' }, /* Top-right tilt */
          '100%': { transform: 'translate(0px, -5px) rotateX(0deg) rotateY(0deg)' }, 
        },
      },

      colors: {
        "sideBar-bg": "var(--sideBar-LightBG)",
        "sideBar-text": "var(--sideBar-LightText)"
      }
    },
    plugins: [
      require('tailwind-scrollbar-hide')
    ],
  }
};
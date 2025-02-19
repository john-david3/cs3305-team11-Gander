import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',  
        'sm': '640px',  
        'md': '768px', 
        'ml': '936px',
        'lg': '1024px', 
        'lx': '1200px',
        'xl': '1280px', 
        '2lg': '1440px',
        '2xl': '1536px',
      },

      animation: {
        moving_text_colour: "moving_text_colour 6s ease-in-out infinite alternate",
        moving_bg: 'moving_bg 50s linear infinite',
        'border-spin': 'border-spin linear infinite',
        floating: "floating 30s linear infinite",
        burnIn: 'burnIn 1s ease-out',
      },



      backgroundImage: {
        logo: "linear-gradient(45deg, #60A5FA, #8B5CF6, #EC4899, #FACC15,#60A5FA, #8B5CF6, #EC4899, #FACC15)",
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        authForm: "linear-gradient(45deg, #1A0B33, #240046, #3C096C, #5A189A)",
        authFormBorder: "linear-gradient(45deg, #3A0CA3, #7209B7, #B5179E, #F72585)",
      },

      keyframes: {
        moving_text_colour: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },

        moving_bg: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '-1280px 1280px' },
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

        burnIn: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },

        fontSize: {
          forgotPasswordResponsive: "clamp(0.3em, 3vw, 5em)",
        }
      },
    },
    plugins: [
      require("tailwind-scrollbar-hide"),
    ],
  }
};
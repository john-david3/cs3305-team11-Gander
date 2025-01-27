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
        moving_bg: 'moving_bg 200s linear infinite'
      },
      
      
      backgroundImage: {
        logo: "linear-gradient(45deg, #60A5FA, #8B5CF6, #EC4899, #FACC15,#60A5FA, #8B5CF6, #EC4899, #FACC15)",
      },

      keyframes: {
        moving_text_colour: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        moving_bg: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 0%' }
        }
      }
    },
  },
  plugins: [
  ],
};
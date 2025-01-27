/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        agog: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },

      animation: {
        agog: "agog 6s linear infinite",
      },

      backgroundImage: {
        agog: "linear-gradient(to right, #60A5FA, #8B5CF6, #EC4899, #FACC15,#60A5FA, #8B5CF6, #EC4899, #FACC15)",
      },
    },
  },
  plugins: [
  ],
};
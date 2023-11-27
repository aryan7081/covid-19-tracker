/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    //...
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {
        '@keyframes spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        '.spin': {
          animation: 'spin 1s linear infinite',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ]
});

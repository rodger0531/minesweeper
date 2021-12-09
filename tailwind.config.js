const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        minesweeper: "minesweeper",
        digital: "digital",
      },
      colors: {
        green: colors.green,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

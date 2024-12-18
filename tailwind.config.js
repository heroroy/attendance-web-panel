/** @type {import('tailwindcss').Config} */

/*eslint-env node*/
/*global someFunction, a*/
/*eslint no-undef: "error"*/
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes : [
      "dracula",
      "light",
      "dark",
    ]
  }
}


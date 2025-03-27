/** @type {import('tailwindcss').Config} */

/*eslint-env node*/
/*global someFunction, a*/
/*eslint no-undef: "error"*/
export default  {
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
    themes: ['winter', 'night'],
  }
}


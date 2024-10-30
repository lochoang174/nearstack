/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fbc40e",
        "primary-dark": "#ce9b0d",
        "primary-light": "#f9e310",
        "primary-black": "#1a232e",
        "primary-white": "#c7c7c7",
        secondary: "#343f71",
        "secondary-dark": "#202844",
        "secondary-light": "#354c70",
        light: "#e0d8e4",
        "light-dark": "#aaa5ad",
        white: "#ffffff",
        pome: "#f34c19",
        "pome-dark": "#af3d15",
        "pome-light": "#ef7c1d",
      },
      keyframes: {
        slide_in_top: {
          '0%': {transform: 'translateY(-1000px)', opacity: '0'},
          '100%': {transform: 'translateY(0)', opacity: '1'}
        },
        slide_out_top: {
          '0%': {transform: 'translateY(0)', opacity: '1'},
          '100%': {transform: 'translateY(-1000px)', opacity: '0'}
        }
      },
      animation: {
        slide_in_top: 'slide_in_top 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        slide_out_top: 'slide_out_top 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both'
      }
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/forms"),
    // require('flowbite/plugin')
  ],
};

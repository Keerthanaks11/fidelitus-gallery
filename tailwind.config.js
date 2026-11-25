/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#1c1917", light: "#57534e", accent: "#b45309" } },
      fontFamily: { serif: ["Cormorant Garamond", "Georgia", "serif"], sans: ["Roboto", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};

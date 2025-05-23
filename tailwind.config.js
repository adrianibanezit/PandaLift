/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,mdx,md}",
],
  theme: {
    extend: {fontFamily: {
      sans: ['Poppins', 'sans-serif'],},
  },
  plugins: [],
};

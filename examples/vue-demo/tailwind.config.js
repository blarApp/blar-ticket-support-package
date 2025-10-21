import preset from '@blario/vue/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // Scan @blario/vue library files for Tailwind classes
    '../../packages/vue/dist/**/*.{js,ts,vue,mjs,cjs}',
  ],
  plugins: [],
};

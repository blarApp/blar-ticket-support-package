import type { Config } from 'tailwindcss';
import preset from '@blario/nextjs/tailwind-preset';

const config: Config = {
  presets: [preset],
  darkMode: "class",
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // Scan @blario/nextjs library files for Tailwind classes
    '../../packages/nextjs/dist/**/*.{js,ts,jsx,tsx,mjs,cjs}',
  ],
  plugins: [],
};
export default config;
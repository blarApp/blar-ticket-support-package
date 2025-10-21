import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  external: [
    'react',
    'react-dom',
    'next',
    'next/navigation',
    'next/image',
    'tailwindcss',
    'tailwindcss-animate',
    'cmdk',
    'vaul',
    'react-hook-form',
    'zod',
    'sonner',
    'lucide-react',
    'next-themes'
  ],
  noExternal: [
    '@radix-ui/*',
    'class-variance-authority',
    'tailwind-merge',
    'clsx',
    'embla-carousel-react',
    'input-otp',
    'react-day-picker',
    'react-resizable-panels',
    'recharts'
  ],
  treeshake: true,
  splitting: false,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
  onSuccess: 'cp -r src/styles dist/',
});
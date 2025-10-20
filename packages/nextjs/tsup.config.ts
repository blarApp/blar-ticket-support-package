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
    'tailwindcss',
    'tailwindcss-animate'
  ],
  noExternal: [
    '@radix-ui/*',
    'lucide-react',
    'class-variance-authority',
    'tailwind-merge',
    'clsx',
    'cmdk',
    'embla-carousel-react',
    'input-otp',
    'react-day-picker',
    'react-hook-form',
    'react-resizable-panels',
    'recharts',
    'next-themes',
    'sonner',
    'vaul',
    'zod'
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
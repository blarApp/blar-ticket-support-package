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
    '@radix-ui/*',
    'lucide-react',
    'class-variance-authority',
    'tailwind-merge',
    'clsx',
    'tailwindcss',
    'tailwindcss-animate'
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
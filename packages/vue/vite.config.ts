import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BlarioVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'radix-vue',
        'lucide-vue-next',
        'class-variance-authority',
        'tailwind-merge',
        'clsx',
        'tailwindcss',
        'tailwindcss-animate',
        'zod',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'blario.css';
          return assetInfo.name || '';
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  plugins: [await import('@vitejs/plugin-react').then(m => m.default())],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.tsx'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globals: true,
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
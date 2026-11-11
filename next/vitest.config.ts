/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  test: {
    environment: 'jsdom',
    env: {
      FRONT_URL: 'http://localhost:3000',
      NEXT_PUBLIC_SITE_ID: 'site-a',
      NEXT_PUBLIC_SITE_NAME: 'Test Site',
      NEXT_PUBLIC_SITE_DESCRIPTION: 'Test site description',
    },
    setupFiles: ['./__tests__/setup.ts'],
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    globals: true,
  },
});

import { defineConfig } from 'vitest/config';

// Unit tests only (pure modules): no React plugin, no browser (PRODUCTION-SERVER#12)
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});

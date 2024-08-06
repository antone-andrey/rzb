import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'https://www.calkoo.com/',
  },
  testDir: './src/tests',
  timeout: 30000,
  retries: 1,
});

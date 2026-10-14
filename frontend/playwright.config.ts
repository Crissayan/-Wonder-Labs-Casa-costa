import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 393, height: 852 }, hasTouch: true } },
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1456, height: 900 } } },
  ],
  webServer: [
    {
      command: 'npm run db:build -w backend && npm run start:dev -w backend',
      cwd: '..',
      port: 3001,
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev',
      port: 5173,
      reuseExistingServer: true,
    },
  ],
});

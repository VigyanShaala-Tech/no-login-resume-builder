import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:8080",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "npm run dev -- --host 127.0.0.1 --port 8080",
      url: "http://127.0.0.1:8080",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "node server.cjs",
      url: "http://127.0.0.1:3001/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        PORT: "3001",
        PLAYWRIGHT_BROWSERS_PATH:
          process.platform === "win32"
            ? `${process.env.LOCALAPPDATA}\\ms-playwright`
            : `${process.env.HOME}/.cache/ms-playwright`,
      },
    },
  ],
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});

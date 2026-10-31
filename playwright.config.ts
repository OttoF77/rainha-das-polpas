import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "python3 -c \"from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler; import os; os.chdir('out'); ThreadingHTTPServer(('127.0.0.1', 3000), SimpleHTTPRequestHandler).serve_forever()\"",
    port: 3000,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});

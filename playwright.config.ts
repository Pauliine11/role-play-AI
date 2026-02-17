import { defineConfig, devices } from "@playwright/test";
import path from "path";

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: path.join(__dirname, "tests"),
  outputDir: "test-results/",
  reporter: [
    ["list"],
    ["html"],
  ],
  webServer: {
    command: "pnpm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL,
    trace: "retry-with-trace",
  },

  projects: [
    {
      name: "global setup",
      testMatch: /global\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "Debug tests",
      testMatch: /.*debug.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "Main tests",
      testMatch: /.*app.spec.ts/,
      use: {
        ...devices["Desktop Chrome"],
        // Note: Main tests gèrent leur propre authentification via setupClerkTestingToken
      },
      dependencies: ["global setup"],
    },
    {
      name: "Homepage tests",
      testMatch: /.*homepage\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.join(__dirname, "playwright/.clerk/user.json"),
      },
      dependencies: ["global setup"],
    },
    {
      name: "Game tests",
      testMatch: /.*game\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.join(__dirname, "playwright/.clerk/user.json"),
      },
      dependencies: ["global setup"],
    },
    {
      name: "Admin tests",
      testMatch: /.*admin\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.join(__dirname, "playwright/.clerk/user.json"),
      },
      dependencies: ["global setup"],
    },
    {
      name: "Authenticated tests",
      testMatch: /.*authenticated.spec.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: path.join(__dirname, "playwright/.clerk/user.json"),
      },
      dependencies: ["global setup"],
    },
  ],
});
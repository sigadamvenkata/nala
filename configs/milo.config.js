// @ts-check
const { devices } = require('@playwright/test');

const envs = require('../envs/envs.js');

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  testDir: '../tests/milo',
  outputDir: '../test-results',
  /* Maximum time one test can run for. */
  timeout: 45 * 1000,
  /**
   * Location of snapshots generated by expect(page).toHaveScreenshot()
   * and expect(snapshot).toMatchSnapshot().
   */
  snapshotPathTemplate: 'screenshots/{testFilePath}/{arg}{ext}',
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.2 },
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['github'], ['../utils/reporters/json-reporter.js'], ['../utils/reporters/json-reporter.js']]
    : [['html', { outputFolder: 'test-html-results' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 60000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    baseURL: process.env.BASE_URL || envs['@milo_live'] || 'https://main--milo--adobecom.hlx.live',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'milo-live-chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: envs['@milo-live'],
        contextOptions: { permissions: ['clipboard-read', 'clipboard-write'] },
      },
    },

    {
      name: 'milo-live-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: envs['@milo-live'],
        launchOptions: {
          firefoxUserPrefs: {
            'dom.events.asyncClipboard.readText': true,
            'dom.events.testing.asyncClipboard': true,
            'dom.events.asyncClipboard.clipboardItem': true,
          },
        },
      },
    },

    {
      name: 'milo-live-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: envs['@milo-live'],
      },
    },

    {
      name: 'milo-prod-chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: envs['@milo_prod'],
        contextOptions: { permissions: ['clipboard-read', 'clipboard-write'] },
      },
    },

    {
      name: 'milo-prod-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: envs['@milo_prod'],
        launchOptions: {
          firefoxUserPrefs: {
            'dom.events.asyncClipboard.readText': true,
            'dom.events.testing.asyncClipboard': true,
          },
        },
      },
    },

    {
      name: 'milo-prod-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: envs['@milo_prod'],
      },
    },

    // Added viewport for standardized window testing for visual comparisons
    {
      name: 'milo-live-chrome-visual',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: envs['@milo-live'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'milo-live-firefox-visual',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: envs['@milo-live'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'milo-live-webkit-visual',
      use: {
        ...devices['Desktop Safari'],
        baseURL: envs['@milo-live'],
        viewport: { width: 1280, height: 720 },
      },
    },

    /* Test visually against mobile viewports. */
    {
      name: 'milo-live-android-visual',
      use: {
        ...devices['Pixel 5'],
        baseURL: envs['@milo-live'],
      },
    },
    {
      name: 'milo-live-iphone-visual',
      use: {
        ...devices['iPhone SE'],
        baseURL: envs['@milo-live'],
      },
    },
    {
      name: 'milo-live-ipad-visual',
      use: {
        ...devices['iPad Mini'],
        baseURL: envs['@milo-live'],
      },
    },
  ],
};
export default config;

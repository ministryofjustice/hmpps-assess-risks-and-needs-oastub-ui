import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'cypress/fixtures',
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: ['cypress/e2e/**/*.cy.ts'],
    supportFile: false,
    testIsolation: true,
  },
})

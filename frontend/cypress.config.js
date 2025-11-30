const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  reporter: "cypress-multi-reporters",

  reporterOptions: {
    reporterEnabled: "spec, junit",
    junitReporterOptions: {
      mochaFile: "reports/e2e-report-[hash].xml",
    },
  },
});

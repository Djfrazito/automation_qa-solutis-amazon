const { defineConfig } = require("cypress");
require('dotenv').config();

module.exports = defineConfig({
  env: {
    ...process.env,
  },
  e2e: {
    baseUrl: "https://www.amazon.com.br",
    viewportHeight:720,
    viewportWidth:1280,
    defaultCommandTimeout: 6000,
    requestTimeout:6000,
    setupNodeEvents(on, config) {
      
      // implement node event listeners here
    },
  },
});

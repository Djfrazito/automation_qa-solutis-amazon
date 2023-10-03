const { defineConfig } = require("cypress");

module.exports = defineConfig({
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

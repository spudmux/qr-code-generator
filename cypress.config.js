const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080', // or your local server port
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
}); 
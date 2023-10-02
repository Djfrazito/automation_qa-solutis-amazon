// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Login na conta do usuário.
 * {String} email
 * {String} password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit("/")
    // Verificando se o navbar existe.
    cy.get('#navbar-main') 
    .should('exist')

    // Abrindo o menu da navbar e clicando em login.
    cy.get("#nav-link-accountList").trigger('mouseover');
    cy.get("#nav-flyout-accountList").should('be.visible');
    cy.get('a[data-nav-ref="nav_signin"]').click();

    // Login com variáveis de ambiente (cypress.env).
    cy.get('#ap_email').should('be.visible').and('have.value', '').type(email, {log: false});
    cy.get('.a-button-input').click();
    cy.get('#ap_password').should('be.visible').and('have.value', '').type(`${password}{enter}`, {log: false});
  }, {cacheAcrossSpecs: true})
})

/*
  * Adiciona endereço na conta do usuário.
  * {Object} address
*/
Cypress.Commands.add('fillAddressDetails', (address) => {
  cy.get("#address-ui-widgets-enterAddressFullName")
    .clear()
    .type(address.name);
  cy.get("#address-ui-widgets-enterAddressPhoneNumber")
    .clear()
    .type(address.phone);
  cy.get("#address-ui-widgets-enterAddressPostalCode")
    .clear()
    .type(address.cep)
    .blur();

  // Esperando a requisição de CEP.
  cy.intercept(
    "POST",
    "https://addresssuggest-na.amazon.com/v1/lookup/places",
  ).as("cep");
  cy.wait("@cep");
  cy.get("#address-ui-widgets-buildingNumber").clear().type(address.number);
});
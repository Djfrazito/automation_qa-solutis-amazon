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
    cy.get('#ap_email').type(email, {log: false});
    cy.get('.a-button-input').click();
    cy.get('#ap_password').type(`${password}{enter}`, {log: false});
  }, {
    cacheAcrossSpecs: true, 
    validate: () => {
      return cy.getCookie("session-token").should("exist");
  }})
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

/**
 * Verifica se o usuário possui pedidos.
 */
Cypress.Commands.add("checkIfUserHasOrders", () => {
  cy.get("#a-page > section > div.your-orders-content-container__content.js-yo-main-content > div.a-row.a-spacing-base > form > label > span")
    .invoke('text')
    .then((text) => {
      const orderCount = parseInt(text);
      if (orderCount === 0) {
        cy.log('O usuário não possui pedidos.');
        cy.get("#a-autoid-1-announce")
          .click()
          .get('a.a-dropdown-link')
          .contains(new Date().getFullYear().toString())
          .click();
      } else {
        cy.log(`O usuário possui ${orderCount} pedidos.`);
      }
    })
})

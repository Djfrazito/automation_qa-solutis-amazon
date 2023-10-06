/**
 * Login na conta do usuário.
 * {String} email
 * {String} password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.session(email, () => {
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
    cy.intercept('GET', 'https://www.amazon.com/aaut/verify/**', {
      query: {
        options: '%7B%22clientData%22%3A%22%7B%5C%22sessionId%5C%22%3A%5C%22133-3733073-8219722%5C%22%2C%5C%22marketplaceId%5C%22%3A%5C%22A2Q3Y263D00KWC%5C%22%2C%5C%22rid%5C%22%3A%5C%220Q5T4J51SW9B51YDSQ7X%5C%22%2C%5C%22ubid%5C%22%3A%5C%22133-9706136-6813011%5C%22%2C%5C%22pageType%5C%22%3A%5C%22AuthenticationPortal%5C%22%2C%5C%22appAction%5C%22%3A%5C%22SIGNIN_PWD_COLLECT%5C%22%2C%5C%22subPageType%5C%22%3A%5C%22SignInClaimCollect%5C%22%7D%22%2C%22challengeType%22%3Anull%2C%22locale%22%3A%22pt-BR%22%2C%22enableHeaderFooter%22%3Atrue%2C%22enableBypassMechanism%22%3Afalse%2C%22enableModalView%22%3Afalse%2C%22eventTrigger%22%3A%22PageLoad%22%7D'
      }
    })
    cy.get('#ap_password').type(`${password}{enter}`, {log: false});
  }, {
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

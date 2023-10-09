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

Cypress.Commands.add('addToCartAndCloseRecommendation', () => {
    cy.intercept('POST', '/cart/add-to-cart/*').as('addToCart');
    cy.get('#add-to-cart-button').should('be.visible').click();
    // Verifica se o botão de fechar da recomendação existe no corpo da página
    cy.get('body').then(($body) => {
      if ($body.find('.a-popover-header').length > 0) {
        // Fecha a recomendação
        cy.get('.a-button-close')
        .should('be.visible')
        .click();
      }
    });
    cy.wait('@addToCart')
});

Cypress.Commands.add('addProductToCart', (productAsin) => {
    // Visitar a página de adicionar ao carrinho pelo ASIN
    cy.visit(`/gp/aws/cart/add.html?ASIN.1=${productAsin}`);
    cy.get('.a-button-input')
    .click();
});

Cypress.Commands.add('addProductToCartAndPlaceOrder', (productAsin) => {
    // Visitar a página de adicionar ao carrinho pelo ASIN
    cy.visit(`/gp/aws/cart/add.html?ASIN.1=${productAsin}`);
    cy.get('.a-button-input')
    .click();
    // Clica no botão de fechar pedido
    cy.get('#sc-buy-box-ptc-button > .a-button-inner > .a-button-input')
        .should('be.visible')
        .click();
});

Cypress.Commands.add('removeProductFromCart', (productAsin) => {
    // Visitar a página do carrinho
    cy.visit('/cart');

    // Encontrar o produto pelo ASIN e clicar no link 'Excluir'
    cy.get(`[data-asin="${productAsin}"]`)
      .find('.sc-action-delete > .a-declarative > .a-color-link')
      .contains('Excluir')
      .click();
});

Cypress.Commands.add('selectAddress', () => {
    cy.get('[data-testid="Address_selectShipToThisAddress"]')
    .should('be.visible')
    .click();
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})
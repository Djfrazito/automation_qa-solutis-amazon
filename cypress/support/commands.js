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
    }, { cacheAcrossSpecs: true })
  });

Cypress.Commands.add('addToCartAndCloseRecommendation', () => {
    cy.intercept('POST', '/cart/add-to-cart/*').as('addToCart');
    cy.get('#add-to-cart-button').should('be.visible').click();
    // Verifica se o botão de fechar da recomendação existe no corpo da página
    cy.get('body').then(($body) => {
      if ($body.find('.a-popover-header > .a-button-close').length > 0) {
        // Fecha a recomendação
        cy.get('.a-button-close').should('be.visible').click();
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
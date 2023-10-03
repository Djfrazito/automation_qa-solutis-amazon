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

Cypress.Commands.add('addToCartAndCloseRecommendation', () =>{
    // fecha a tela de recomendação se ela for exibida
    cy.get('#add-to-cart-button').should('be.visible').click();
    cy.get('body').then(($body) => {
        if ($body.find('.a-popover-header > .a-button-close').length > 0) {   // verifica se o botão existe no corpo
            cy.get('.a-button-close')
                .should('be.visible')
                .click();
        }
    });
});

Cypress.Commands.add('waitForAutoComplete', () => {
    // aguarda a proxima requisição de atualização de UI
    cy.intercept('POST', '**AutocompleteUIServiceMetrics**').as('getCart');
    cy.wait('@getCart');
});

Cypress.Commands.add('addProductToCart', (productAsin) => {
    // Visitar a página do produto
    cy.visit(`/dp/${productAsin}`);
  
    // Adicionar o produto ao carrinho e fechar a recomendação
    cy.addToCartAndCloseRecommendation();
  
    // Ir para o carrinho
    cy.get('.a-spacing-base > .a-button > .a-button-inner > .a-button-text')
      .should('be.visible')
      .click();
  });
  
  Cypress.Commands.add('removeProductFromCart', (productAsin) => {
    cy.visit('/cart')
    // Encontrar o produto pelo ASIN e clicar no link 'Excluir'
    cy.get(`[data-asin="${productAsin}"]`)
      .find('.sc-action-delete > .a-declarative > .a-color-link')
      .contains('Excluir')
      .click();
  });
  
  

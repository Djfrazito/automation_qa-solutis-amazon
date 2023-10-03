const email = Cypress.env("AMAZON_EMAIL");
const password = Cypress.env("AMAZON_PASSWORD");

const productAsin = require('../fixtures/productAsin.json')
let quantity = ''

beforeEach(() => {
    cy.login(email, password);
    cy.addProductToCart(productAsin.echoDot);
});

afterEach(() => {
    cy.removeProductFromCart(productAsin.echoDot);
});

describe('Página do carrinho de compras', () => {
    it('Valida botão de fechar pedido', () => {

        // valida botão de fechar pedido
        cy.get('#sc-buy-box-ptc-button > .a-button-inner > .a-button-input')
        .should('be.visible');
    });

    it('Deve alterar a quantidade de um item do carrinho', () => {
        cy.visit('/cart');

        quantity = '2'
        cy.get(`[data-asin="${productAsin.echoDot}"]`)
        .find('.a-dropdown-prompt')
        .should('be.visible')
        .click();
        cy.intercept('GET', '/gp/cart/checkout-*').as('getQuantity');
        cy.get(`#quantity_${quantity}`)
        .should('be.visible')
        .click();
        cy.wait('@getQuantity');
        cy.get(`[data-asin="${productAsin.echoDot}"]`)
        .find('.a-dropdown-prompt')
        .contains(`${quantity}`);
    });

    it('Deve fornecer o link de compartilhamento do produto', () => {
        cy.get(`[data-asin="${productAsin.echoDot}"]`)
        .get('.a-size-small.sc-invisible-when-no-js > .a-declarative > .a-link-normal')
        .trigger('click');
        
        // Valida se o link possui o ASIN do produto selecionado
        cy.get('.link-section')
        .should('be.visible')
        .contains(`${productAsin.echoDot}`);
    });

    it('Deve salvar o produto selecionado para mais tarde', () => {
        cy.visit('/cart');
        cy.intercept('POST', '/cart/ref=ox_sc_cart_actions_*').as('saveCart');
        cy.get(`[data-asin="${productAsin.echoDot}"]`)
        .contains('Salvar para mais tarde')
        .click();
        cy.wait('@saveCart');

        // valida produto na lista de itens salvos e retorna ao carrinho
        cy.intercept('POST', '/cart/ref=ox_sc_mtc_*').as('removeFromFavorites');
        cy.get('#sc-secondary-list')
        .should('be.visible')
        .find(`[data-asin="${productAsin.echoDot}"]`)
        .should('be.visible')
        .find('.a-button-input')
        .contains('Mover para o carrinho')
        .click();
        cy.wait('@removeFromFavorites');
    });
});
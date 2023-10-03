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

    it('Deve alterar a Qtd de um iten do pedido', () => {
        cy.visit('/cart');

        quantity = '2'
        cy.get(`[data-asin="${productAsin.echoDot}"]`)
        .find('.a-dropdown-prompt')
        .should('be.visible')
        .click();
        cy.get(`#quantity_${quantity}`)
        .should('be.visible')
        .click();
        cy.get(`[data-asin="${productAsin.echoDot}"]`)
        .find('.a-dropdown-prompt')
        .contains(`${quantity}`)
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
        cy.get(`[data-asin="${productAsin.echoDot}"]`)
        .contains('Salvar para mais tarde')
        .click();

        // valida produto na lista de itens salvos e retorna ao carrinho
        cy.get('#sc-secondary-list')
        .should('be.visible')
        .find(`[data-asin="${productAsin.echoDot}"]`)
        .should('be.visible')
        .find('[id^="a-autoid-"] > .a-button-inner > .a-button-input')
        .should('be.visible')
        .contains('Mover para o carrinho')
        .click();
    });

    it('Deve excluir o iten do carrinho', () => {
        cy.removeProductFromCart(productAsin.echoDot)
    });
});
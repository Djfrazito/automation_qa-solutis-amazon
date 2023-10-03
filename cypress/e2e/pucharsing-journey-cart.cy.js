const productAsin = require('../fixtures/productAsin.json')
let quantity = '';

beforeEach(() => {
    // Amazon Standard Identification Number
    cy.visit(`/dp/${productAsin.echoDot}`)
});

describe('Página de produto adicionar ao carrinho', () => {

    it('Valida botão de adicionar ao carrinho na PDP', () => {
        cy.get('#add-to-cart-button').should('be.visible');
            }); 

    it('Deve adicionar o produto ao carrinho', () => {

        cy.intercept('GET', '/cart/ewc/compact?hostPageType=ShoppingCartAdd*').as('addToCart');
        cy.addToCartAndCloseRecommendation();
        cy.wait('@addToCart')

        cy.waitForAutoComplete();
    
        // verifica se o número de itens no cart corresponde a 1
        cy.get('#nav-cart-count').should('be.visible').invoke('text').then((text) => {
            expect(text.trim()).to.eq('1');
        });
    });

    it('Deve adicionar uma quantidade do produto ao carrinho pela PDP', () => {
        quantity = '2';

        cy.intercept('GET', '/gp/product/ajax*').as('getProductQuantity');
        cy.get('#quantity')
        .should('be.visible')
        .select(`${quantity}`);
        cy.wait('@getProductQuantity');
        cy.addToCartAndCloseRecommendation();
        cy.waitForAutoComplete();
    
        // verifica se o número de itens no cart corresponde à quantidade a quantidade selecionada
        cy.get('#nav-cart-count').should('be.visible').invoke('text')
        .then((text) => {
            expect(text.trim()).to.eq(quantity);
        });
    });
    
    it('Deve cancelar a adição de itens pelo menu lateral do carrinho', () => {
        cy.intercept('GET', '/cart/ewc/compact?hostPageType=ShoppingCartAdd*').as('addToCart');
        cy.addToCartAndCloseRecommendation();
        cy.wait('@addToCart')

        cy.waitForAutoComplete();

        cy.intercept('POST', '/cart/ewc/update?ref_=ewc_delete_*').as('deleteFromCart');
        cy.get('input[title="Excluir"]').trigger('click');

        cy.get('[data-csa-c-func-deps="aui-da-ewc-delete-item"]').should('not.exist');
        cy.get('#nav-cart-count').should('be.visible').click();
        cy.wait('@deleteFromCart')

        cy.get('#nav-cart-count').invoke('text')
        .then((text) => {
            expect(text.trim()).to.eq('0');
        });
    });
    
});
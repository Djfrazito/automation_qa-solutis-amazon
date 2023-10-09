const productAsin = require('../fixtures/productAsin.json')
let quantity = '';
const selectedProduct = productAsin.echoDot;

beforeEach(() => {
    // Amazon Standard Identification Number
    cy.visit(`/dp/${selectedProduct}`)
});

describe('Página de produto adicionar ao carrinho', () => {

    it('Valida botão de adicionar ao carrinho na PDP', () => {
        cy.get('#add-to-cart-button')
        .should('be.visible');
    }); 

    it('Deve adicionar o produto ao carrinho', () => {
        cy.addToCartAndCloseRecommendation();
        // verifica se o número de itens no cart corresponde a 1
        cy.get('#nav-cart-count')
        .should('be.visible')
        .should('have.text', '1');
    });

    it('Deve adicionar uma quantidade do produto ao carrinho pela PDP', () => {
        quantity = '2';

        cy.intercept('GET', `/gp/product/ajax?&asin=${selectedProduct}**`).as('getProductQuantity');
        cy.get('#quantity')
        .should('be.visible')
        .select(`${quantity}`);
        cy.wait('@getProductQuantity');
        cy.addToCartAndCloseRecommendation();
    
        // verifica se o número de itens no cart corresponde à quantidade a quantidade selecionada
        cy.get('#nav-cart-count')
        .should('be.visible')
        .should('have.text', `${quantity}`);
    });
    
    it('Deve cancelar a adição de itens pelo menu lateral do carrinho', () => {
        cy.addToCartAndCloseRecommendation();
        
        cy.intercept('POST', '/cart/ewc/update?ref_=ewc_delete_*').as('deleteFromCart');
        cy.wait(1000);

        // Clicla no botão de excluir do carrinho
        cy.get('[data-action="ewc-delete-item"]')
        .should('be.visible')  
        .trigger('mouseover')
        .click();
        cy.wait('@deleteFromCart');

        // Verifica se o número de itens no cart corresponde à zero
        cy.get('#nav-cart-count')
        .should('be.visible')
        .should('have.text', '0');
    });
});
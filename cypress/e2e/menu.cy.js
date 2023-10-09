let seachProduct = '';

beforeEach(() => {
  cy.visit('/');
})

describe('Validar menu lateral', () => {

  it('Valida exibição do menu lateral', () => {
    cy.get('#nav-hamburger-menu').should('be.visible').click();
    })

  it('Valida Filtros', () => {
    cy.get('#nav-hamburger-menu').should('be.visible').click();
    cy.get('a.hmenu-item').contains('Novidades na Amazon').click();
    cy.get('#zg_banner_text').should('be.visible');
    cy.get('#nav-hamburger-menu').click();
    cy.get('a.hmenu-item').contains('Mais Vendidos').click();
    cy.get('#zg_banner_text').should('be.visible');
    cy.get('#nav-hamburger-menu').click();
    cy.get('a.hmenu-item').contains('Produtos em alta').click();
    cy.get('#zg_banner_text').should('be.visible');
  })

  it('Valida itens', () => {
    cy.get('#nav-hamburger-menu').should('be.visible').click();
    cy.get('a.hmenu-item').contains('Novidades na Amazon').click();
    cy.get('#zg_banner_text').should('be.visible');
    cy.get('.zg-carousel-general-faceout').should('be.visible');
  })
})
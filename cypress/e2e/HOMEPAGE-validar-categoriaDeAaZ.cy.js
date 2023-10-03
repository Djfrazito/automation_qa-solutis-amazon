
beforeEach(() => {

  cy.visit('/');
})

describe('Validar categoria de "A a Z"', () => {
    it('Selecionar a categoria "Livros" e direcionar a página', () => {
        
        cy.contains('.a-color-base','Navegue pelas categorias, de A a Z').should('be.visible');
        cy.get('.feed-carousel-card').eq(1).click();

    })

    it('Selecionar a categoria "Games e Consoles" e direcionar a página', () => {
        
        cy.contains('.a-color-base','Navegue pelas categorias, de A a Z').should('be.visible');
        cy.get('.feed-carousel-card').eq(5).click();

    })

    it('Selecionar a categoria "Brinquedos e jogos" e direcionar a página', () => {
        
        cy.contains('.a-color-base','Navegue pelas categorias, de A a Z').should('be.visible');
        cy.get('.feed-carousel-card').eq(7).click();

    })

})


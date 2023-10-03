

beforeEach(() => {

  cy.visit('/');
})

describe('Validar topBar', () => {
    it('Direcionar mouse a "Contas e Listas" no topBar, depois clicar em "Seu amazon music"' , () => {
    
        cy.get('#nav-link-accountList').should('be.visible').trigger('mouseover');
        cy.wait(3000);
        cy.contains('.nav-text', 'Seu Amazon Music').should('be.visible').click();
    })

    it('Identificar a categoria de produtos "Mais vendidos" no topBar e direcionar a página', () => {

        cy.get('[data-csa-c-slot-id="nav_cs_1"]').should('be.visible').click();

    })

    it('Identificar "Devoluções e Pedidos" no topBar e direcionar a página', () => {
    
        cy.get('#nav-orders').should('be.visible').click();

    })

})

afterEach(() => {

    cy.screenshot();
    
})
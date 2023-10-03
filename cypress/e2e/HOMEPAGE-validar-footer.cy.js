let footerTopics = '';

beforeEach(() => {

  cy.visit('/');
})

describe('Validar roda-pé', () => {
  it('Clicar no link de "Cartão de Crédito" do roda-pé para redirecionar a essa janela', () => {

    footerTopics = 'Cartão de Crédito';
  
    cy.contains('.nav_a', footerTopics).should('be.visible').click(); 
  })

  it('Clicar no link de "Seja um associoado" do roda-pé para redirecionar a essa janela', () => {

    footerTopics = 'Seja um associado';
    cy.wait(3000);
    cy.contains('.nav_a', footerTopics).should('be.visible').click();

  })

  
  it('Clicar no link de "Ajuda" do roda-pé para redirecionar a essa janela', () => {

    footerTopics = 'Ajuda';
    cy.wait(3000);
    cy.contains('.nav_a', footerTopics).should('be.visible').click();

  })
})

let searchProduct = '';

beforeEach(() => {

  cy.visit('/');

  searchProduct = 'tv';

  //busca um produto
  cy.get('input[placeholder="Pesquisa Amazon.com.br"]')
  .should('be.visible')
  .type(searchProduct);
  
  cy.get('#nav-search-submit-button')
  .should('be.visible')
  .click();
  
  cy.get('span')
  .contains(searchProduct)
  .should('be.visible');

  //clica no primeiro produto do resultado da pesquisa
  cy.get('.s-search-results [data-cel-widget="search_result_2"]')
  .should('be.visible')
  .find('a')
  .first()
  .click();

})

describe('Valida avaliações do produto', () => {

  it('Verifica se há um título e ele está visível', () => {

    cy.get('#reviewsMedley h2')
    .should('have.text', 'Avaliações de clientes')
    .and('be.visible');

  });

  it('Verifica se é exibido o número de avaliações', () => {
    cy.get('[data-hook="total-review-count"]')
    .should('be.visible')
    .and(($element) => {
      const texto = $element.text();
      expect(texto).to.match(/\d+/);
    });
  });

  it('Verifica se é exibida a nota média das avaliações', () => {
    cy.get('[data-hook="rating-out-of-text"]')
    .should('be.visible')
    .and(($element) => {
      const texto = $element.text();
      expect(texto).to.match(/\d+/);
    });
  });

});
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

describe('Página do produto', () => {

  it.skip('Valida carrossel de produtos relacionados', () => {
    
  });

})
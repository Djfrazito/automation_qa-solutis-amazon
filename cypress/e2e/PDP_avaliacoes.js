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

  it('Valida avaliações do produto: Título indicativo do campo', () => {

    cy.get('#reviewsMedley h2')
    .should('have.text', 'Avaliações de clientes')
    .and('be.visible');

  });

  it.skip('Valida avaliações do produto: Número de avaliações', () => {

  });

  it.skip('Valida avaliações do produto: Nota média das avaliações', () => {


    
  });

  it.skip('Valida avaliações do produto: Seção de comentários', () => {


    
  });

})
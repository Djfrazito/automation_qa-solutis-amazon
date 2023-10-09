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

  cy.contains('Produtos relacionados a este item').scrollIntoView();
})

describe('Valida carrossel de produtos relacionados', () => {

  it('Verifica se a lista de produtos do carrossel não está vazia', () => {
    cy.get('#anonCarousel1 ol')
    .should('not.be.empty');
  });

  it('Verifica se a os botões de direita e esquerda estão visíveis e clicáveis', () => {
    cy.get('.a-carousel-right')
    .first()
    .should('be.visible')
    .click();

    cy.get('.a-carousel-left')
    .first()
    .should('be.visible')
    .click();
  });

})
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

describe('Valida principais informações', () => {

  it('Verifica se o título está visível e não vazio', () => {

    cy.get('#productTitle')
    .should('be.visible')
    .and('not.be.empty');
  
  });

  it('Verifica se existe uma imagem que está visível', () => {

    cy.get('#imgTagWrapperId')
    .find('img')
    .should('be.visible');

  });

  it('Verifica os títulos e tabelas de detalhes do produto, se estão visíveis e não vazias', () => {
    
    cy.get('#prodDetails')
    .should('be.visible')
    .find('h2')
    .should('not.be.empty')
    .and('be.visible');

    //primeira tabela
    //titulo
    cy.get('#prodDetails')
    .find('h1')
    .first()
    .should('not.be.empty')
    .and('be.visible');

    //primeiro item da tabela
    cy.get('#prodDetails')
    .find('table tbody')
    .first()
    .find('tr')
    .first()
    .should('exist')
    .and('be.visible');


    //segunda tabela
    //titulo
    cy.get('#prodDetails')
    .find('h1')
    .eq(1)
    .should('not.be.empty')
    .and('be.visible');

    //primeiro item da tabela
    cy.get('#prodDetails')
    .find('table tbody')
    .eq(1)
    .find('tr')
    .first()
    .should('exist')
    .and('be.visible');

  });

  it('Verifica se o preço não está vazio e é visível', () => {

    cy.get('.priceToPay span')
    .should('be.visible')
    .and('not.be.empty');

  });

  it('Verifica se o botão de Adicionar ao Carrinho, possui texto indicativo e está visível', () => {
    
    cy.get('#add-to-cart-button + span')
    .should('have.text', 'Adicionar ao carrinho')
    .and('be.visible');
  
    cy.get('#add-to-cart-button')
    .should('be.visible')
    .click();

  });

})
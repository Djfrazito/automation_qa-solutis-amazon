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

  it('Valida principais informações: Título', () => {

    cy.get('#productTitle')
    .should('be.visible')
    .and('not.be.empty');
  
  });

  it('Valida principais informações: Imagem', () => {

    cy.get('#imgTagWrapperId')
    .find('img')
    .should('be.visible');

  });

  it('Valida principais informações: Detalhes do produto', () => {
    
    cy.get('#prodDetails')
    .should('be.visible')
    .find('h2')
    .should('have.text', '\n                                Informações sobre o produto ')
    .and('be.visible');

    //primeira tabela
    //titulo
    cy.get('#prodDetails')
    .find('h1')
    .first()
    .should('have.text', 'Detalhes técnicos')
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
    .should('have.text', 'Informações adicionais')
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

  it('Valida principais informações: Preço', () => {

    cy.get('.priceToPay span')
    .should('be.visible')
    .and('not.be.empty');

  });

  it('Valida principais informações: Botão de Adicionar ao Carrinho', () => {
    
    cy.get('#add-to-cart-button + span')
    .should('have.text', 'Adicionar ao carrinho')
    .and('be.visible');
  
    cy.get('#add-to-cart-button')
    .should('be.visible')
    .click();

  });

})
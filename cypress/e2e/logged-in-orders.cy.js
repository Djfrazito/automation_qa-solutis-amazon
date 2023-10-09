const email = Cypress.env("AMAZON_EMAIL");
const password = Cypress.env("AMAZON_PASSWORD");

let search;

beforeEach(() => {
  cy.login(email, password);
});

describe("Tela de meus pedidos", () => {
  it("Validando pesquisa de pedidos.", () => {
    search = "Pote";
    cy.visit("/gp/your-account/order-history");
    cy.checkIfUserHasOrders();
    // Pesquisando por um produto.
    cy.get("input[name='search']").type(`${search}{enter}`);
    cy.get('span').contains(search).should('be.visible');
  })

  it("Validando botão de comprar novamente.", () => {
    cy.visit("/gp/your-account/order-history");
    cy.checkIfUserHasOrders();
    cy.get("a[aria-label='Comprar novamente']").first().click();
    // Adicionando e removendo o primeiro item dos pedidos.
    cy.get("input[name='submit.addToCart']").first().click();
    cy.get("#atc-stepper-remove-button").first().click();
  })

  it("Validando a avaliação do produto.", () => {
    cy.visit("/gp/your-account/order-history");
    cy.checkIfUserHasOrders();
    cy.get("a:contains('Avaliar o produto')").first().click();

    // Avaliando o produto com 5 estrelas.
    cy.get("div[class='a-section a-spacing-top-micro'] > button[data-hook='ryp-star']:nth-child(5)")
      .should("be.visible")
      .click();

    // Avaliando características do produto.
    for (let i = 1; i < 4 ; i++) {
      cy.get(`button[data-hook='ryp-star']:nth-child(${i})`)
        .eq(i)
        .should("be.visible")
        .click();
    }

    // Escrevendo o título da avaliação. 
    cy.get("input[data-hook=ryp-review-title-input]").type("Produto muito bom");
    // Adicionando uma imagem e escrevendo avaliação escrita.
    cy.get("input[type=file]").selectFile("cypress/images/imagem.png", {force: true});
    cy.get("#scarface-review-text-card-title").type("Eu recomendo este produto.");
  })
});
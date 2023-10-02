const email = Cypress.env("AMAZON_EMAIL");
const password = Cypress.env("AMAZON_PASSWORD");
let search;

beforeEach(() => {
  cy.login(email, password);
});

describe("Tela de meus pedidos", () => {
  it("Validando login.", () => {
    cy.visit("/");
    // Verificando se o usuário está logado.
    cy.getCookie("session-token").should("exist");
  })

  it("Validando se o usuário possui pedidos.", () => {
    cy.visit("/gp/your-account/order-history")
    cy.checkIfUserHasOrders();
  })

  it("Validando pesquisa de pedidos.", () => {
    search = "Pote";
    cy.visit("/gp/your-account/order-history");
    cy.checkIfUserHasOrders();
    cy.get("input[name='search']").type(`${search}{enter}`);
    cy.get('span').contains(search).should('be.visible');
  })

  it("Validando botão de comprar novamente.", () => {
    cy.visit("/gp/your-account/order-history");
    cy.checkIfUserHasOrders();
    cy.get("#a-autoid-2-announce").click();
    // Adicionando e removendo o primeiro item dos pedidos.
    cy.get("input[name='submit.addToCart']").first().click();
    cy.get("#atc-stepper-remove-button").first().click();
  })

  it("Validando a avaliação do produto.", () => {
    cy.visit("/gp/your-account/order-history");
    cy.checkIfUserHasOrders();
    cy.get("#a-autoid-4-announce").click();
    cy.get("div[class='a-section a-spacing-top-micro'] > button[data-hook='ryp-star']:nth-child(5)")
      .should("be.visible")
      .click();

    for (let i = 1; i < 4 ; i++) {
      cy.get(`button[data-hook='ryp-star']:nth-child(${i})`)
        .eq(i)
        .should("be.visible")
        .click();
    }

    cy.get("input[data-hook=ryp-review-title-input]").type("Produto muito bom");
    cy.get("input[type=file]").selectFile("cypress/images/imagem.png", {force: true});
    cy.get("#scarface-review-text-card-title").type("Eu recomendo este produto.");
  })
  
  it("Validando botão de ver o item comprado.", () => {
    cy.visit("/gp/your-account/order-history");
    cy.checkIfUserHasOrders();
    cy.get("#a-autoid-3-announce").click();
    cy.contains("a.a-size-base-plus.a-link-normal", "Exibir detalhes do produto").first().click();
  })
});
const email = Cypress.env("AMAZON_EMAIL");
const password = Cypress.env("AMAZON_PASSWORD");

const productAsin = require("../fixtures/productAsin.json");
let quantity = "";

const selectedProduct = productAsin.bonecoHomemAranha;

beforeEach(() => {
  cy.login(email, password, 3);
  cy.addProductToCart(selectedProduct);
});

afterEach(() => {
  cy.removeProductFromCart(selectedProduct);
});

describe("Página do carrinho de compras", () => {
  it("Valida botão de fechar pedido", () => {
    // valida botão de fechar pedido
    cy.get("#sc-buy-box-ptc-button > .a-button-inner > .a-button-input").should(
      "be.visible"
    );
  });

  it("Deve alterar a quantidade de um item do carrinho", () => {
    cy.visit("/cart");

    quantity = "2";
    cy.get(`[data-asin="${selectedProduct}"]`)
      .find(".a-dropdown-prompt")
      .should("be.visible")
      .click();
    cy.get(`#quantity_${quantity}`)
      .should("be.visible")
      .click()
      .then(() => {
        // Verifique se a quantidade no carrinho foi atualizada
        cy.get(`[data-asin="${selectedProduct}"]`)
          .find(".a-dropdown-prompt")
          .should("have.text", quantity);
      });
  });

  it("Deve fornecer o link de compartilhamento do produto", () => {
    cy.get(`[data-asin="${selectedProduct}"]`)
      .get(
        ".a-size-small.sc-invisible-when-no-js > .a-declarative > .a-link-normal"
      )
      .contains("Compartilhar")
      .click();

    // Valida se o link possui o ASIN do produto selecionado
    cy.get(".link-section")
      .should("be.visible")
      .should("include.text", `${selectedProduct}`);
  });

  it("Deve salvar o produto selecionado para mais tarde", () => {
    cy.visit("/cart");
    cy.intercept("POST", "/cart/ref=ox_sc_cart_actions_*").as("saveCart");
    cy.get(`[data-asin="${selectedProduct}"]`)
      .contains("Salvar para mais tarde")
      .click();
    cy.wait("@saveCart");

    // valida produto na lista de itens salvos e retorna ao carrinho
    cy.intercept("POST", "/cart/ref=ox_sc_mtc_*").as("removeFromFavorites");
    cy.get("#sc-saved-cart-items")
      .should("be.visible")
      .find(`[data-asin="${selectedProduct}"]`)
      .should("be.visible")
      .find(".a-button-input")
      .contains("Mover para o carrinho")
      .click();
    cy.wait("@removeFromFavorites");
  });
});

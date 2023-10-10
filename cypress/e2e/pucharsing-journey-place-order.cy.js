const email = Cypress.env("AMAZON_EMAIL");
const password = Cypress.env("AMAZON_PASSWORD");
const productAsin = require("../fixtures/productAsin.json");

const selectedProduct = productAsin.bonecoGroot;
let quantity = "";

beforeEach(() => {
  cy.login(email, password, 3);
  cy.addProductToCartAndPlaceOrder(selectedProduct);
});

afterEach(() => {
  cy.removeProductFromCart(selectedProduct);
});

describe("Tela de fechamento do pedido", () => {
  it("Valida o botão de seleção do endereço", () => {
    cy.get('[data-testid="Address_selectShipToThisAddress"]').should(
      "be.visible"
    );
  });
  it("Valida adicionar instruções de entrega", () => {
    // Clique em "Adicionar instruções de entrega"
    cy.get('[data-csa-c-type="widget"] > .a-link-normal')
      .contains("Adicionar instruções de entrega")
      .should("be.visible")
      .click();

    // Clique em "Alterar" se existir
    cy.get(".ma-selected-property-type > .a-declarative > .a-link-normal")
      .contains("Alterar")
      .should("exist")
      .click();

    // Selecione o tipo "Apartamento"
    cy.get(".ma-apartment-type-button > .a-button-inner > .a-button-text")
      .should("be.visible")
      .click();

    // Clique no botão "Salvar"
    cy.get("#cdp-save-button").should("be.visible").click();

    // Verifique se "Adicionar instruções de entrega" está visível novamente
    cy.get('[data-csa-c-type="widget"] > .a-link-normal')
      .contains("Adicionar instruções de entrega")
      .should("be.visible")
      .click();

    // Verifique se "Apartamento" foi selecionado
    cy.get(
      ".a-size-base.a-color-base.ma-saved-property-type-text.a-text-bold"
    ).should("have.text", "Apartamento");
  });

  it("Valida adicionar cartão de crédito como método de pagamento", () => {
    cy.selectAddress();
    // Clica em adicionar um cartão de crédito
    cy.intercept(
      "POST",
      "https://apx-security.amazon.com.br/cpe/pm/register"
    ).as("postApxSubmit");
    cy.get(".apx-add-pm-trigger-image")
      .should("be.visible")
      .trigger("mouseover")
      .click();
    cy.wait("@postApxSubmit");
  });

  it("Valida mensagem de erro ao tentar adicionar cupom incorreto durante a seleção do metodo de pagamento", () => {
    cy.selectAddress();
    // Clica no botão de aplicar cupom de desconto
    cy.get('input[name="ppw-claimCodeApplyPressed"]')
      .should("be.visible")
      .click();
    // Verifica se a mensagem de erro é exibida
    cy.get(
      ".pmts-error-message-inline > .a-box > .a-box-inner > .a-alert-content > p"
    ).should(
      "have.text",
      "É necessário um cartão de presente ou código promocional."
    );
  });
  it("Deve fechar o pedido com o Pix", () => {
    cy.selectAddress();

    // Clica no campo de texto do metodo de pagamento pix
    cy.get(".pmts-pix-text-content")
      .should("be.visible")
      .scrollIntoView()
      .click();

    // Clica em usar esta forma de pagamento
    cy.get("#orderSummaryPrimaryActionBtn > .a-button-inner > .a-button-input")
      .scrollIntoView()
      .should("be.visible")
      .click();

    // Aguarda carregamento de detalhes da compra
    cy.intercept(
      "POST",
      "/gp/buy/shared/handlers/async-continue.html/ref=chk_pay_change_coll*"
    ).as("asyncContinue");
    cy.get("#spc-orders").should("be.visible");
    cy.wait("@asyncContinue");

    // Válida botão de finalizar compra
    cy.get('input[name="placeYourOrder1"]').should("be.visible");
  });
  it("Deve fechar o pedido com boleto", () => {
    cy.selectAddress();

    // Clica no icone do boleto em métodos de pagamento
    cy.get(".pmts-boleto-icon-img")
      .should("be.visible")
      .trigger("mouseover")
      .click();

    // Clica em usar esta forma de pagamento
    cy.get("#orderSummaryPrimaryActionBtn > .a-button-inner > .a-button-input")
      .scrollIntoView()
      .should("be.visible")
      .click();
    cy.get("#spc-orders").should("be.visible");

    // Clica no primeiro botão de finalizar pedido
    cy.get('input[name="placeYourOrder1"]').should("be.visible").first();
    //.click();
  });
});

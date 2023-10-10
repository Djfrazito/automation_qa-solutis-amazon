import { fakerPT_BR } from "@faker-js/faker";
const email = Cypress.env("AMAZON_EMAIL");
const password = Cypress.env("AMAZON_PASSWORD");

let address = {
  name: fakerPT_BR.person.fullName(),
  phone: fakerPT_BR.phone.number(),
  number: fakerPT_BR.location.buildingNumber(),
  cep: "05750220",
};

beforeEach(() => {
  cy.login(email, password, 5);
});

describe("Tela de meus endereços", () => {
  it("Adicionando endereço na conta do usuário.", () => {
    cy.visit("/");
    // Acessando a página de endereços.
    cy.get('[data-nav-ref="nav_youraccount_btn"]').click();
    cy.contains("a.ya-card__whole-card-link", "Endereços").click();
    cy.get("#ya-myab-address-add-link").click();
    cy.handleUnableToProcessPage();
    // Adicionando um novo endereço.
    cy.fillAddressDetails(address);
    cy.get("#address-ui-widgets-form-submit-button > span > input").click();
  });

  it("Alterando o endereço do usuário.", () => {
    cy.visit("/a/addresses?ref_=ya_d_c_addr");
    // Verificando se o endereço foi adicionado.
    cy.get(".a-column.a-span4.a-spacing-none.a-spacing-top-mini.address-column")
      .should("exist")
      .children()
      .and("contain", address.cep)
      .then(() => {
        address.cep = "08420720"; // Avenida Professor João Batista Conti
        address.number = "456";
        cy.log("Achou cep e número do endereço");
        cy.get("a#ya-myab-address-edit-btn-1").click();

        // Editando o endereço.
        cy.fillAddressDetails(address);
        cy.get("#address-ui-widgets-form-submit-button > span > input")
          .should("be.visible")
          .click();
      });
  });

  it("Removendo o endereço do usuário caso já exista.", () => {
    cy.visit("/a/addresses?ref_=ya_d_c_addr");
    // Verificando se o endereço foi adicionado.
    cy.intercept(
      "GET",
      "/hz/rhf?currentPageType=YourAccountAddressBook&currentSubPageType=*"
    ).as("getAddresses");
    cy.wait("@getAddresses");
    cy.get(
      ".a-section.address-section-no-default > * > * > li > .a-list-item > #address-ui-widgets-CityStatePostalCode"
    )
      .should("be.visible")
      .each(($card, index) => {
        const cardText = $card.text();
        cy.log($card.text());
        if (cardText.includes("08420720")) {
          cy.get(`a#ya-myab-address-delete-btn-${index}`).click();
          cy.get(
            `#deleteAddressModal-${index}-submit-btn > span > .a-button-input`
          )
            .should("be.visible")
            .click()
            .type("{enter}");
          return false;
        }
      });

    cy.url().then((url) => {
      if (url.includes("/a/addresses/delete")) {
        cy.visit("/a/addresses?ref_=ya_d_c_addr");
      }
    });
  });
});

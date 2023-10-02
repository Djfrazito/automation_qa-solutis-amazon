const email = Cypress.env("AMAZON_EMAIL");
const password = Cypress.env("AMAZON_PASSWORD");
const address = {
  name: "Ricardo",
  phone: "11999999999",
  cep: "04326100",
  number: "123",
};

beforeEach(() => {
  cy.login(email, password);
});

describe("loggedIn", () => {
  it("Validando login", () => {
    cy.visit("/");
    // Verificando se o usuário está logado.
    cy.getCookie("session-token").should("exist");
  });

  it("Adiciona endereço na conta do usuário", () => {
    cy.visit("/");
    // Acessando a página de endereços.
    cy.get('[data-nav-ref="nav_youraccount_btn"]').click();
    cy.contains("a.ya-card__whole-card-link", "Endereços").click();
    cy.get("#ya-myab-address-add-link").click();

    cy.location("pathname")
      .should("not.include", "/unableToProcess")
      .then(() => {
        cy.log("Não está na página de erro");
      });

    // Adicionando um novo endereço.
    cy.get("#address-ui-widgets-enterAddressFullName")
      .clear()
      .type(address.name);
    cy.get("#address-ui-widgets-enterAddressPhoneNumber")
      .clear()
      .type(address.phone);
    cy.get("#address-ui-widgets-enterAddressPostalCode")
      .type(address.cep)
      .blur();
    // Esperando a requisição de CEP.
    cy.intercept(
      "POST",
      "https://addresssuggest-na.amazon.com/v1/lookup/places",
    ).as("cep");
    cy.wait("@cep");
    cy.get("#address-ui-widgets-buildingNumber").type(address.number);
    cy.get("#address-ui-widgets-form-submit-button > span > input").click();
  });
});

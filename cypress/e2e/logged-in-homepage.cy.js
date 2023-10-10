const email = Cypress.env("AMAZON_EMAIL");
const password = Cypress.env("AMAZON_PASSWORD");

beforeEach(() => {
  cy.login(email, password, 5);
  cy.visit("/");
});

describe("Tela homepage da area logada", () => {
  it("Validando botões da homepage.", () => {
    cy.get('[data-nav-ref="nav_youraccount_btn"]').click();

    // Clicando em cada botão da homepage de login.
    cy.get("a.ya-card__whole-card-link")
      .should("exist")
      .each((_, index) => {
        cy.get("a.ya-card__whole-card-link")
          .eq(index)
          .click({ force: true })
          .should("have.attr", "href");
        cy.go("back");
      });
  });

  it("Validando os links de cada card da homepage.", () => {
    cy.get('[data-nav-ref="nav_youraccount_btn"]').click();

    // Validando se os cards existem
    cy.get(".ya-card-cell").should("exist");

    // Validando se os cards possuem 24 links
    cy.get(".ya-card-cell .a-list-item a").should("have.length", 24);

    // Array com o titulo dos cards
    const expectedCardsTitle = [
      "Conteúdo digital e dispositivos",
      "Alertas de e-mail, mensagens e anúncios",
      "Mais formas de pagamento",
      "Configurações de compras e pedidos",
      "Outras contas",
      "Assinaturas",
      "Dados e privacidade",
    ];

    // Validando se o titulo dos cards são iguais ao array
    cy.get(".a-box > .a-box-inner > .ya-card__heading--poor").each(
      (_, index) => {
        cy.get(".a-box > .a-box-inner > .ya-card__heading--poor").contains(
          expectedCardsTitle[index]
        );
      }
    );
  });
});

/*
 * Faz login na conta do usuário com tentativas de captcha.
 * {String} email
 * {String} password
 * {Number} tentativas
 */
Cypress.Commands.add("login", (email, password, tentativas) => {
  const loginAttempt = (tentativasContagem) => {
    // Caso cair no captcha mais de 5 vezes, o teste é pulado.
    if (tentativasContagem <= 0) {
      Cypress.mocha.getRunner().suite.ctx.skip();
    }

    cy.session(
      email,
      () => {
        cy.visit("/");
        cy.get("#navbar-main").should("exist");
        cy.get("#nav-link-accountList").trigger("mouseover");
        cy.get("#nav-flyout-accountList").should("be.visible");
        cy.get('a[data-nav-ref="nav_signin"]').click();

        cy.get("#ap_email").type(email, { log: false });
        cy.get(".a-button-input").click();
        cy.url().then((url) => {
          if (url.includes("/ap/signin?openid.pape.max_auth_age=")) {
            loginAttempt(tentativasContagem - 1);
          }
        });
        cy.get("#ap_password").type(`${password}{enter}`, { log: false });

        /*
         * Verificando se o usuário caiu no captcha.
         * Caso sim, é feito uma nova tentativa de login.
         * IMPORTANTE: É necessário que o usuário tenha o login salvo no navegador para
         * não pedirem a verificação de duas etapas.
         */
        cy.url().then((url) => {
          if (url.includes("/ap/cvf/request?arb=")) {
            loginAttempt(tentativasContagem - 1);
          } else {
            if (Cypress.$("h4").length > 0) {
              cy.get("h4").then(($alert) => {
                if (
                  $alert.hasClass("a-alert-heading") ||
                  $alert.text().includes("Mensagem importante!") ||
                  $alert
                    .text()
                    .includes("Digite os caracteres que você vê abaixo")
                ) {
                  loginAttempt(tentativasContagem - 1);
                }
              });
            } else {
              cy.getCookie("session-token").should("exist");
            }
          }
        });
      },
      {
        cacheAcrossSpecs: true,
        validate: () => {
          return cy.getCookie("session-token").should("exist");
        },
      }
    );
  };

  loginAttempt(tentativas);
});

/*
 * Adiciona endereço na conta do usuário.
 * {Object} address
 */
Cypress.Commands.add("fillAddressDetails", (address) => {
  cy.get("#address-ui-widgets-enterAddressFullName").clear().type(address.name);
  cy.get("#address-ui-widgets-enterAddressPhoneNumber")
    .clear()
    .type(address.phone);
  cy.get("#address-ui-widgets-enterAddressPostalCode")
    .clear()
    .type(address.cep)
    .blur();

  // Esperando a requisição de CEP.
  cy.intercept(
    "POST",
    "https://addresssuggest-na.amazon.com/v1/lookup/places"
  ).as("cep");
  cy.wait("@cep");
  cy.get("#address-ui-widgets-buildingNumber").clear().type(address.number);
});

/**
 * Verifica se o usuário possui pedidos.
 */
Cypress.Commands.add("checkIfUserHasOrders", () => {
  cy.get(
    "#a-page > section > div.your-orders-content-container__content.js-yo-main-content > div.a-row.a-spacing-base > form > label > span"
  )
    .invoke("text")
    .then((text) => {
      const orderCount = parseInt(text);
      if (orderCount === 0) {
        cy.log("O usuário não possui pedidos.");
        cy.get("#a-autoid-1-announce")
          .click()
          .get("a.a-dropdown-link")
          .contains(new Date().getFullYear().toString())
          .click();
      } else {
        cy.log(`O usuário possui ${orderCount} pedidos.`);
      }
    });
});

Cypress.Commands.add("handleUnableToProcessPage", () => {
  cy.url().then((url) => {
    if (url.includes("/unableToProcess")) {
      cy.get("h1")
        .contains("Desculpe-nos!")
        .then(() => {
          Cypress.mocha.getRunner().suite.ctx.skip();
        });
    }
  });
});

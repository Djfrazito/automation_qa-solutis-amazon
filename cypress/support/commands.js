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

Cypress.Commands.add('addToCartAndCloseRecommendation', () => {
    cy.intercept('POST', '/cart/add-to-cart/*').as('addToCart');
    cy.get('#add-to-cart-button').should('be.visible').click();
    // Verifica se o botão de fechar da recomendação existe no corpo da página
    cy.get('body').then(($body) => {
      if ($body.find('.a-popover-header').length > 0) {
        // Fecha a recomendação
        cy.get('.a-button-close')
        .should('be.visible')
        .click();
      }
    });
    cy.wait('@addToCart')
});

Cypress.Commands.add('addProductToCart', (productAsin) => {
    // Visitar a página de adicionar ao carrinho pelo ASIN
    cy.visit(`/gp/aws/cart/add.html?ASIN.1=${productAsin}`);
    cy.get('.a-button-input')
    .click();
});

Cypress.Commands.add('addProductToCartAndPlaceOrder', (productAsin) => {
    // Visitar a página de adicionar ao carrinho pelo ASIN
    cy.visit(`/gp/aws/cart/add.html?ASIN.1=${productAsin}`);
    cy.get('.a-button-input')
    .click();
    // Clica no botão de fechar pedido
    cy.get('#sc-buy-box-ptc-button > .a-button-inner > .a-button-input')
        .should('be.visible')
        .click();
});

Cypress.Commands.add('removeProductFromCart', (productAsin) => {
    // Visitar a página do carrinho
    cy.visit('/cart');

    // Encontrar o produto pelo ASIN e clicar no link 'Excluir'
    cy.get(`[data-asin="${productAsin}"]`)
      .find('.sc-action-delete > .a-declarative > .a-color-link')
      .contains('Excluir')
      .click();
});

Cypress.Commands.add('selectAddress', () => {
    cy.get('[data-testid="Address_selectShipToThisAddress"]')
    .should('be.visible')
    .click();
});

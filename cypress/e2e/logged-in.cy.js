const email = Cypress.env('AMAZON_EMAIL')
const password = Cypress.env('AMAZON_PASSWORD')

beforeEach(() => {
  cy.visit('/')
})

// TODO: Commitar a parte de login
describe('loggedIn', () => {
  it('Validando login', () => {
    // Verificando se o navbar existe.
    cy.get('#navbar-main') 
      .should('exist')

    // Abrindo o menu da navbar e clicando em login.
    cy.get("#nav-link-accountList").trigger('mouseover');
    cy.get("#nav-flyout-accountList").should('be.visible');
    cy.get('a[data-nav-ref="nav_signin"]').click();

    // Login com variáveis de ambiente (cypress.env).
    cy.get('#ap_email').should('be.visible').and('have.value', '').type(email, {log: false});
    cy.get('.a-button-input').click();
    cy.get('#ap_password').should('be.visible').and('have.value', '').type(`${password}{enter}`, {log: false});

    // Verificando se o usuário está logado.
    cy.url().should('include', '?ref_=nav_signin');
    cy.getCookie('session-token').should('exist');
  })
})
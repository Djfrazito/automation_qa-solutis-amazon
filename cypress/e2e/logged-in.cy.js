const email = Cypress.env('AMAZON_EMAIL')
const password = Cypress.env('AMAZON_PASSWORD')

beforeEach(() => {
  cy.login(email, password);
})

describe('loggedIn', () => {
  it('Validando login', () => {
    cy.visit('/');
    // Verificando se o usuário está logado.
    cy.getCookie('session-token').should('exist');
  })
})
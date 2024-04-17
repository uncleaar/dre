describe('template sign-in spec', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4000/sign-in')
  });

  it('renders the login form', () => {
    cy.get('form').should('exist');
    cy.get('[data-testId="email"]').should('exist');
    cy.get('[data-testId="password"]').should('exist');
  });

  it('validates form fields', () => {
    cy.get('[data-testId="email"]').type('invalidemail');
    cy.get('[data-testId="password"]').type('1234');
    cy.get('button').contains('Sign in').click();
  });

  it('successfully logs in the user', () => {
    cy.get('[data-testId="email"]').type('123@123.ru');
    cy.get('[data-testId="password"]').type('A123456!');
    cy.get('button').contains('Sign in').click();
    cy.url().should('include', '/');
  });
})

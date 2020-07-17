describe('Login', () => {
  it('shows error messages with invalid input', () => {
    cy.visit('/login')
    cy.contains('ログイン')

    cy.get('input[name="email"]')
      .type('invalid@example.com')
      .should('have.value', 'invalid@example.com')
    cy.get('input[name="password"]')
      .type('password')
      .should('have.value', 'password')

    cy.contains('button', 'ログイン')
      .click()

    cy.contains('メールアドレスまたはパスワードが正しくありません')
  })

  it('redirects to home and shows flash when logged in', () => {
    cy.visit('/login')

    cy.get('input[name="email"]')
      .type('test@example.com')
      .should('have.value', 'test@example.com')
    cy.get('input[name="password"]')
      .type('password')
      .should('have.value', 'password')

    cy.contains('button', 'ログイン')
      .click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })
    cy.contains('ログインしました')
    cy.contains('テストユーザー')
  })
})

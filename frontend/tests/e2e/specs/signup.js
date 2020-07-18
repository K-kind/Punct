describe('Sign up', () => {
  it('shows error messages with invalid input', () => {
    cy.visit('/signup')
    cy.contains('h2', '新規登録')

    cy.get('input[name="name"]')
      .type('テストユーザー2')
      .should('have.value', 'テストユーザー2')

    cy.get('input[name="email"]')
      .type('test@example.com')
      .should('have.value', 'test@example.com')
    cy.get('input[name="email_confirmation"]')
      .type('test2@example.com')
      .should('have.value', 'test2@example.com')

    cy.get('input[name="password"]')
      .type('password')
      .should('have.value', 'password')
    cy.get('input[name="password_confirmation"]')
      .type('password invalid')
      .should('have.value', 'password invalid')

    cy.contains('button', '登録する')
      .click()

    cy.contains('パスワード（確認）とパスワードの入力が一致しません')
    cy.contains('メールアドレス（確認）とメールアドレスの入力が一致しません')
    cy.contains('すでに存在します')
  })

  it('redirects to home and shows flash when signed up', () => {
    cy.visit('/signup')

    cy.get('input[name="name"]')
      .type('テストユーザー2')
      .should('have.value', 'テストユーザー2')

    cy.get('input[name="email"]')
      .type('test2@example.com')
      .should('have.value', 'test2@example.com')
    cy.get('input[name="email_confirmation"]')
      .type('test2@example.com')
      .should('have.value', 'test2@example.com')

    cy.get('input[name="password"]')
      .type('password')
      .should('have.value', 'password')
    cy.get('input[name="password_confirmation"]')
      .type('password')
      .should('have.value', 'password')

    cy.contains('button', '登録する')
      .click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })
    cy.contains('登録が完了しました')
    cy.contains('テストユーザー2')
  })
})

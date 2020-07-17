describe('Logout', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should be visited from the nav-menu', () => {
    cy.visit('/')
    cy.contains('テストユーザー')
      .click()
    cy.contains('ログアウト')
      .click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login')
    })

    cy.contains('ログアウトしました')
  })
})

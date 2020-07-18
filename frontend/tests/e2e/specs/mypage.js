describe('My page', () => {
  beforeEach(() => {
    cy.login()
  })

  it('should be visited from the nav-menu', () => {
    cy.visit('/')
    cy.contains('テストユーザー')
      .click()
    cy.contains('マイページ')
      .click()

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/mypage')
    })
  })

  it('shows user information', () => {
    cy.visit('/mypage')

    cy.get('.board')
      .should('contain', 'テストユーザー')
      .and('contain', 'test@example.com')
  })
})

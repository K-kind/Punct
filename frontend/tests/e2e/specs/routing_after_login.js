describe('Routing after login', () => {
  beforeEach(() => {
    cy.login()
  })

  it('fowards to the requested path', () => {
    cy.visit('/')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })

    cy.visit('/archives')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/archives')
    })

    cy.visit('/mypage')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/mypage')
    })
  })

  it('redirects to the root path', () => {
    cy.visit('/login')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })

    cy.visit('/signup')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })

    cy.visit('/reset')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/')
    })
  })
})

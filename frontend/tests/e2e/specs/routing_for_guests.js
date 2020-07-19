describe('Routing for guests', () => {
  it('redirects to the about path', () => {
    cy.visit('/')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/about')
    })
  })

  it('redirects to the login path', () => {
    cy.visit('/archives')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login')
    })

    cy.visit('/mypage')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login')
    })
  })

  it('redirects to the login path with flash', () => {
    cy.visit('/oauth')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login')
    })
    cy.contains('失敗しました')

    cy.visit('/reset')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login')
    })
    cy.contains('無効なリンク')
  })

  it('forwards to the requested path', () => {
    cy.visit('/login')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login')
    })

    cy.visit('/signup')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/signup')
    })
  })
})

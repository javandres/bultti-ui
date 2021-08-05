describe('Authentication tests', () => {
  it('Cannot see unauthorized elements when not logged in', () => {
    cy.visit('/')
    cy.getTestElement('authInfo').should('not.exist')
  })

  it('Can log in with HSL ID - admin', () => {
    cy.loginAdmin()

    cy.getTestElement('authInfo').should('exist')
    cy.getTestElement('userRole').contains('Admin')
  })

  it('Can log out - admin', () => {
    cy.loginAdmin()

    cy.getTestElement('logoutButton').should('exist').click()

    cy.getTestElement('authInfo').should('not.exist')
    cy.getTestElement('userRole').should('not.exist')
  })

  it('Can log in with HSL ID - HSL User', () => {
    cy.loginHSL()

    cy.getTestElement('authInfo').should('exist')
    cy.getTestElement('userRole').contains('HSL käyttäjä')
  })

  it('Can log in with HSL ID - Operator', () => {
    cy.loginOperator()

    cy.getTestElement('authInfo').should('exist')
    cy.getTestElement('userRole').contains('Liikennöitsijä')
  })
})

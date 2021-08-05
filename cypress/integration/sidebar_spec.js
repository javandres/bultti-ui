describe('Sidebar selection tests', () => {
  beforeEach(() => {
    cy.visitAndSpy('/')
  })

  afterEach(() => {
    cy.get('@consoleError', { timeout: 1000 }).should((errorLog) =>
      expect(errorLog).to.have.callCount(0)
    )
  })

  it('Can select an operator in the sidebar', () => {
    cy.loginAdmin()
    cy.selectTestOperator()
  })

  it('Can select a season in the sidebar', () => {
    cy.loginAdmin()
    cy.selectTestSeason()
  })
})

describe('Pre-inspection', () => {
  before(() => {
    cy.loginAdmin()
    cy.generateTestData()
  })

  beforeEach(() => {
    cy.visitAndSpy('/')
  })

  afterEach(() => {
    cy.get('@consoleError', { timeout: 1000 }).should((errorLog) =>
      expect(errorLog).to.have.callCount(0)
    )
  })

  it('Can create a pre-inspection', () => {
    cy.loginAdmin()
    cy.selectTestSettings()

    cy.getTestElement('edit_pre_inspection').should('exist').click()
    cy.getTestElement('create_new_pre_inspection').should('exist').click()
  })
})

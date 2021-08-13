describe('Procurement units', () => {
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

  it('Can list procurement units', () => {
    cy.visit('/procurement-units')
    cy.selectTestSettings()

    cy.getTestElement('procurement_unit_', '*').should('have.length.at.least', 1)

    cy.getTestElement('procurement_unit_', '*').each((unit) => {
      unit.find('[data-cy*="_section"]').click()
    })
  })

  it('Can open procurement units', () => {
    cy.visit('/procurement-units')
    cy.selectTestSettings()
  })
})

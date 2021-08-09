describe('Pre-inspection creation', () => {
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

  it('Can reject in review pre-inspection', () => {
    cy.loginAdmin()
    cy.openTestReviewPreInspection()

    cy.getTestElement('reject_inspection').click()
  })

  it('Can set pre-inspection in review', () => {
    cy.loginAdmin()

    cy.visit('/pre-inspection/edit')
    cy.selectTestSettings()

    cy.createTestReviewPreInspection()
  })
})

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

  // Test rejection first to clean up any existing InReview pre-inspections. The next
  // test will create a new one to test that whole process, and there cannot be
  // two InReview inspections concurrently.
  it('Can reject in review pre-inspection', () => {
    cy.loginAdmin()
    cy.openTestReviewPreInspection()

    cy.getTestElement('reject_inspection').click()
  })

  it('Can set pre-inspection in review', () => {
    cy.loginAdmin()
    cy.createTestReviewPreInspection()
  })

  it('Can publish pre-inspection', () => {
    cy.loginAdmin()
    cy.openTestReviewPreInspection()

    cy.getTestElement('publish_inspection').click()
  })
})

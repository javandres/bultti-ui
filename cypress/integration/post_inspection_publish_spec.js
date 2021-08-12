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

  it.skip('Can set post-inspection sanctionable', () => {
    cy.loginAdmin()
    cy.createTestSanctionPostInspection()
  })

  it.skip('Can revert sanctionable post-inspection to draft', () => {
    cy.loginAdmin()
    cy.openTestSanctionPostInspection()

    cy.getTestElement('inspection_tabs_tab_sanction').click()
    cy.getTestElement('revert_inspection_to_draft').click()
  })

  it('Can publish sanctionable post-inspection', () => {
    cy.loginAdmin()
    cy.openTestSanctionPostInspection()

    // Not really any point in a separate test case for submitting post-inspections.
    cy.getTestElement('submit_inspection').click()
    cy.getTestElement('inspection_status').should('contain.text', 'Hyväksyttävänä')

    cy.getTestElement('publish_inspection_hsl').click()
    cy.getTestElement('hsl_accepted').should('contain.text', 'HSL hyväksynyt')

    cy.url().as('inspection_url')

    cy.loginOperator()

    cy.get('@inspection_url').then((inspectionUrl) => {
      cy.visit(inspectionUrl)

      cy.getTestElement('publish_inspection_operator').click()
      cy.getTestElement('hsl_accepted').should('contain.text', 'HSL hyväksynyt')

      // Remove inspection to prevent post-inspections from piling up.
      cy.getTestElement('remove_inspection').click()
    })
  })
})

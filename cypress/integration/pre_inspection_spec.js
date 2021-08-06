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
    cy.createTestPreInspection()
    // We are not testing deletion, but if we don't delete, test inspections will pile up.
    // Separate delete draft inspection test is not needed.
    cy.getTestElement('remove_inspection').click()
  })

  it('Can set a name on the pre-inspection', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()

    cy.getTestElement('inspection_name').type('Test inspection')
    cy.getTestElement('inspection_config_save').click()
    cy.getTestElement('inspection_name_title').contains('Test inspection')

    cy.getTestElement('remove_inspection').click()
  })
})

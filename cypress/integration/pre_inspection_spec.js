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

  it('Can change pre-inspection period', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()

    cy.getTestElement('select_inspection_period').click()
    cy.getTestElement('select_inspection_period_1')
      .find(`[data-cy~="inspection_date_option_display"]`)
      .text()
      .as('selected_inspection_period')

    cy.getTestElement('select_inspection_period_1').click()

    cy.getTestElement('inspection_config_save').click()
    cy.on('window:confirm', () => true)

    cy.get('@selected_inspection_period').then((selectedPeriod) => {
      cy.getTestElement('select_inspection_period').contains(selectedPeriod)
    })

    cy.wait(3000) // Some requests are triggered after period change, wait a while before deleting.
    cy.getTestElement('remove_inspection').click()
  })
})

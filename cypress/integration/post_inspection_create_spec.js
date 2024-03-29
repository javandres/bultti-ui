describe('Post-inspection creation', () => {
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
    cy.getTestElement('info_message_error').should('not.exist')
  })

  it('Can create a post-inspection', () => {
    cy.loginAdmin()
    cy.createTestPostInspection()
  })

  it('Can delete post-inspection', () => {
    cy.loginAdmin()
    cy.openTestPostInspection()

    cy.getTestElement('remove_inspection').click()
  })

  it('Can set a name on the post-inspection', () => {
    cy.loginAdmin()
    cy.openTestPostInspection()

    cy.getTestElement('inspection_name').type('Test inspection')
    cy.getTestElement('inspection_config_save').click()
    cy.getTestElement('inspection_name_title').contains('Test inspection')
  })

  it('Can change post-inspection period', () => {
    cy.loginAdmin()
    cy.openTestPostInspection()

    cy.getTestElement('select_inspection_period').click()

    cy.getTestElement('select_inspection_period_0')
      .find(`[data-cy~="inspection_date_option_display"]`)
      .text()
      .as('selected_inspection_period')

    cy.getTestElement('select_inspection_period_0').click()
    cy.getTestElement('inspection_config_save').click()

    cy.get('@selected_inspection_period').then((selectedPeriod) => {
      cy.getTestElement('select_inspection_period').contains(selectedPeriod)
    })
  })

  it('Can update linked pre-inspection', () => {
    cy.loginAdmin()
    // Must have a production pre-inspection for this test.
    cy.openTestProductionPreInspection()
    cy.openTestPostInspection()

    cy.ensureLinkedPreInspection()
  })

  it('Can open report preview tab', () => {
    cy.loginAdmin()
    cy.openTestPostInspection()

    cy.getTestElement('inspection_tabs_tab_reports').click()
    cy.getTestElement('inspection_reports').should('exist')

    cy.getTestElement('inspection_reports_report_section', '*').first().click()
    cy.getTestElement('inspection_reports_report', '*').should('exist')
  })
})

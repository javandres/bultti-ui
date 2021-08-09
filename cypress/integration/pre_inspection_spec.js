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

    // We are not testing deletion, but if we don't delete, test inspections will pile up.
    // Separate delete draft inspection test is not needed.
    cy.wait(1000)
    cy.getTestElement('remove_inspection').click()
  })

  it.skip('Can create a pre-inspection', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()
  })

  it.skip('Can set a name on the pre-inspection', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()

    cy.getTestElement('inspection_name').type('Test inspection')
    cy.getTestElement('inspection_config_save').click()
    cy.getTestElement('inspection_name_title').contains('Test inspection')
  })

  it.skip('Can change pre-inspection period', () => {
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
  })

  it.skip('Can change pre-inspection production period', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()

    cy.getTestElement('production_start').clear().type('11.01.2021').blur()
    cy.getTestElement('production_end').clear().type('23.05.2021').blur()
    cy.getTestElement('inspection_config_save').click()
  })

  it.skip('Can fetch pre-inspection departure blocks', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()

    cy.getTestElement('departure_blocks_section').click()
    cy.getTestElement('fetch_departure_blocks').click()
    cy.getTestElement('departure_blocks_table_row', '*').should('have.length.at.least', 1)
  })

  it.skip('Can open execution requirements', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()

    cy.getTestElement('execution_requirements_section').click()
    cy.getTestElement('execution_requirements_table_row', '*').should(
      'have.length.at.least',
      1
    )
  })

  it.skip('Can open procurement units and their requirements', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()

    cy.getTestElement('procurement_unit_0_section').click()

    cy.getTestElement('procurement_unit_0_requirements_table_row', '*').should(
      'have.length.at.least',
      1
    )

    cy.getTestElement(
      'procurement_unit_0_requirements_equipment_equipment_list_row',
      '*'
    ).should('have.length.at.least', 1)
  })

  // TODO: Test adding and removing equipment and changing percentage quotas.

  it('Can open reports preview tab', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()

    cy.getTestElement('inspection_tabs_tab_reports').click()
    cy.getTestElement('inspection_reports').should('exist')

    cy.getTestElement('inspection_reports_report_section', '*').first().click()
    cy.getTestElement('inspection_reports_report', '*').should('exist')
  })
})

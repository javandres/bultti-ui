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

  it('Can create a pre-inspection', () => {
    cy.loginAdmin()
    cy.createTestPreInspection()
  })

  it('Can delete pre-inspection', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

    cy.wait(1000)
    cy.getTestElement('remove_inspection').click()
  })

  it('Can set a name on the pre-inspection', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

    cy.getTestElement('inspection_name').type('Test inspection')
    cy.getTestElement('inspection_config_save').click()
    cy.getTestElement('inspection_name_title').contains('Test inspection')
  })

  it('Can change pre-inspection period', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

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

  it('Can change pre-inspection production period', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

    cy.getTestElement('production_start').clear().type('11.01.2021').blur()
    cy.getTestElement('production_end').clear().type('23.05.2021').blur()
    cy.getTestElement('inspection_config_save').click()
  })

  it('Can fetch pre-inspection departure blocks', () => {
    cy.loginAdmin()
    // Create a new pre-inspection for this test as we want the departure blocks to not be fetched.
    cy.createTestPreInspection()

    cy.getTestElement('departure_blocks_section').click()
    cy.getTestElement('fetch_departure_blocks').click()
    cy.getTestElement('departure_blocks_table_row', '*').should('have.length.at.least', 1)

    // Delete the created pre-inspection.
    cy.getTestElement('remove_inspection').click()
  })

  it('Can open execution requirements', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

    cy.getTestElement('execution_requirements_section').click()
    cy.getTestElement('execution_requirements_table_row', '*').should(
      'have.length.at.least',
      1
    )
  })

  it('Can open procurement units and their requirements', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

    cy.getTestElement('procurement_unit_section').first().click()

    cy.getTestElement('procurement_unit_requirements_table_row', '*').should(
      'have.length.at.least',
      1
    )

    cy.getTestElement(
      'procurement_unit_requirements_equipment_equipment_list_row',
      '*'
    ).should('have.length.at.least', 1)
  })

  // TODO: Test adding and removing equipment and changing percentage quotas.

  it('Can open reports preview tab', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

    cy.getTestElement('inspection_tabs_tab_reports').click()
    cy.getTestElement('inspection_reports').should('exist')

    cy.getTestElement('inspection_reports_report_section', '*').first().click()
    cy.getTestElement('inspection_reports_report', '*').should('exist')
  })
})

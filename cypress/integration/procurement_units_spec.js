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

  it.skip('Can list procurement units', () => {
    cy.loginAdmin()
    cy.visit('/procurement-units')
    cy.selectTestSettings()

    cy.getTestElement('procurement_unit', '*').should('have.length.at.least', 1)

    cy.getTestElement('procurement_unit_section', '*').each((unit) => {
      unit.click()
    })
  })

  it('Can open procurement unit and show details', () => {
    cy.loginAdmin()
    cy.visit('/procurement-units')
    cy.selectTestSettings()

    cy.getTestElement('procurement_unit_section').first().click()

    cy.getTestElement('unit_contract_button').should('exist')
    cy.getTestElement('unit_config_display').should('exist')
    cy.getTestElement('edit_unit_config').click()
    cy.getTestElement('unit_config_form').should('exist')
    cy.getTestElement('unit_equipment_catalogue_section').should('have.length.at.least', 1)

    cy.getTestElement('unit_equipment_catalogue_section').first().click()
    cy.getTestElement('catalogue_details').should('exist')
    cy.getTestElement('catalogue_equipment_list_row_', '*').should('have.length.at.least', 1)

    cy.getTestElement('catalogue_add_equipment_find').click()
    cy.getTestElement('catalogue_add_equipment_vehicle_id_field').type('9993')
    cy.getTestElement('catalogue_add_equipment_search_done').click()

    cy.getTestElement('catalogue_add_equipment_quota_field').type('5')
    cy.getTestElement('catalogue_add_equipment_accept_equipment').click()

    cy.get('[data-cy*="catalogue_equipment_list_row"][class*="TableRow"]')
      .last()
      .as('added_equipment_row')

    cy.get('@added_equipment_row')
      .find('[class*="TableCell__TableCellElement"]')
      .first()
      .find('[class*="TableCell__CellContent"]')
      .first()
      .should('contain', '9993')

    cy.get('@added_equipment_row')
      .find('[class*="TableCell__TableCellElement"]')
      .eq(3)
      .find('[class*="TableCell__CellContent"]')
      .first()
      .should('contain', '5%')
  })
})

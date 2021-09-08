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
    cy.loginAdmin()
    cy.visit('/procurement-units')
    cy.selectTestSettings()

    cy.getTestElement('procurement_unit', '*').should('have.length.at.least', 1)

    cy.getTestElement('procurement_unit_section', '*').each((unit) => {
      unit.click()
    })
  })

  it('Can open procurement unit', () => {
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

    cy.getTestElement('catalogue_equipment_list_row_element', '*').should(
      'have.length.at.least',
      1
    )
  })

  it('Can save procurementUnit option year as empty', () => {
    cy.loginAdmin()
    cy.visit('/procurement-units')
    cy.selectTestSettings()

    cy.getTestElement('procurement_unit_section').first().click()

    cy.getTestElement('edit_unit_config').click()
    cy.getTestElement('option_period_start_input').focus().clear().type('16.09.2021')
    cy.getTestElement('item_form_save_button').click()
    cy.getTestElement('option_period_start_value').should('contain.text', '16 Sep 2021')

    cy.getTestElement('edit_unit_config').click()
    cy.getTestElement('option_period_start_input').focus().clear()
    cy.getTestElement('item_form_save_button').click()
    cy.getTestElement('option_period_start_value').should('contain.text', '')
  })

  it('Can add/remove equipment', () => {
    cy.loginAdmin()
    cy.visit('/procurement-units')
    cy.selectTestSettings()

    cy.getTestElement('procurement_unit_section').first().click()
    cy.getTestElement('unit_equipment_catalogue_section').first().click()

    cy.getTestElement('catalogue_add_equipment_find').click()
    cy.getTestElement('catalogue_add_equipment_vehicle_id_field').type('9993')
    cy.getTestElement('catalogue_add_equipment_search_done').click()

    cy.getTestElement('catalogue_add_equipment_quota_field').type('5')
    cy.getTestElement('catalogue_add_equipment_accept_equipment').click()

    cy.getTestElement('catalogue_equipment_list_sort_0').click()

    // Wait for the add request to go through
    cy.waitUntil(() => cy.getTestElement('table_row_9993', '*').should('exist'), {
      timeout: 10000,
    })

    // Table row testId contains the value of the first cell, which allows us to select it easily.
    cy.getTestElement('table_row_9993', '*').first().as('equipment_row')

    cy.get('@equipment_row').find('[data-cy*="cell_content_9993"]').should('exist')
    cy.get('@equipment_row').find('[data-cy*="cell_content_5"]').should('exist')

    // Remove when done.
    cy.get('@equipment_row').find('[data-cy$="_remove_btn"]').first().click({ force: true })
    cy.on('window:confirm', () => true)
  })

  it('Can add equipment from a list', () => {
    cy.loginAdmin()
    cy.visit('/procurement-units')
    cy.selectTestSettings()

    cy.getTestElement('procurement_unit_section').first().click()
    cy.getTestElement('unit_equipment_catalogue_section').first().click()

    cy.getTestElement('catalogue_add_equipment_batch_add').click()
    cy.getTestElement('catalogue_add_equipment_batch_field').type('9995 7\n9994 8')
    cy.getTestElement('catalogue_add_equipment_batch_done').click()

    cy.getTestElement('catalogue_equipment_list_sort_0').click()

    // Wait for the add request to go through
    cy.waitUntil(() => cy.getTestElement('table_row_9995', '*').should('exist'), {
      timeout: 10000,
    })

    // Table row testId contains the value of the first cell, which allows us to select it easily.
    cy.getTestElement('table_row_9995', '*').first().as('9995_row')

    cy.get('@9995_row').find('[data-cy*="cell_content_9995"]').should('exist')
    cy.get('@9995_row').find('[data-cy*="cell_content_7"]').should('exist')

    // Remove added rows when done.
    cy.get('@9995_row').find('[data-cy$="_remove_btn"]').first().click({ force: true })

    cy.getTestElement('table_row_9994', '*').first().as('9994_row')

    cy.get('@9994_row').find('[data-cy*="cell_content_9994"]').should('exist')
    cy.get('@9994_row').find('[data-cy*="cell_content_8"]').should('exist')

    cy.get('@9994_row').find('[data-cy$="_remove_btn"]').first().click({ force: true })
  })
})

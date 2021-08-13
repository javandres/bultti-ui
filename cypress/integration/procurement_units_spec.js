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

  it('Can open procurement unit and add/remove equipment', () => {
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

    cy.wrap(false).as('did_find_row')

    // Rows must be looped because it is not certain in which order the added equipment will be shown.
    cy.get(
      '[data-cy^="catalogue_equipment_list_row"][class^="TableRow__TableRowElement"]'
    ).each((row) => {
      if (row.find('[class^="TableCell__CellContent"]:contains("9993")').length) {
        cy.wrap(row).as('equipment_row')

        cy.get('@equipment_row')
          .find('[class^="TableCell__TableCellElement"]')
          .eq(3)
          .find('[class^="TableCell__CellContent"]')
          .first()
          .should('contain', '5%') // Assert that it has the correct percentage.

        cy.get('@equipment_row')
          .find('[data-cy$="_remove_btn"]')
          .first()
          .click({ force: true })

        cy.on('window:confirm', () => true)

        // Record that the added equipment was found.
        cy.wrap(true).as('did_find_row')
      }
    })

    // Assert that the added equipment was found.
    cy.get('@did_find_row').should('be.true')
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

    // Set up the booleans indicating that the added equipment was found as false.
    cy.wrap(false).as('did_find_row_9995')
    cy.wrap(false).as('did_find_row_9994')

    cy.get(
      '[data-cy^="catalogue_equipment_list_row"][class^="TableRow__TableRowElement"]'
    ).each((row) => {
      // Rows must be looped because it is not certain in which order the added equipment will be shown.
      if (row.find('[class^="TableCell__CellContent"]:contains("9995")').length) {
        console.log('9995 found')
        // If the row for the added equipment 9995 is found, assert that it has the correct percentage.
        cy.wrap(row).as('9995_row')

        cy.get('@9995_row')
          .find('[class^="TableCell__TableCellElement"]')
          .eq(3)
          .find('[class^="TableCell__CellContent"]')
          .first()
          .should('contain', '7%')

        // Remove it when done.
        cy.get('@9995_row').find('[data-cy$="_remove_btn"]').first().click({ force: true })
        cy.on('window:confirm', () => true)
        // Record that the added equipment 9995 was found.
        cy.wrap(true).as('did_find_row_9995')
      }
    })

    cy.get(
      '[data-cy^="catalogue_equipment_list_row"][class^="TableRow__TableRowElement"]'
    ).each((row) => {
      if (row.find('[class^="TableCell__CellContent"]:contains("9994")').length) {
        console.log('9994 found')
        // If the row for the added equipment 9994 is found, assert that it has the correct percentage.
        cy.wrap(row).as('9994_row')

        cy.get('@9994_row')
          .find('[class^="TableCell__TableCellElement"]')
          .eq(3)
          .find('[class^="TableCell__CellContent"]')
          .first()
          .should('contain', '8%')

        // Remove it when done.
        cy.get('@9994_row').find('[data-cy$="_remove_btn"]').first().click({ force: true })
        cy.on('window:confirm', () => true)
        // Record that the added equipment 9994 was found.
        cy.wrap(true).as('did_find_row_9994')
      }
    })

    // Assert that both added equipment rows were found in the table.
    cy.get('@did_find_row_9995').should('be.true')
    cy.get('@did_find_row_9994').should('be.true')
  })
})

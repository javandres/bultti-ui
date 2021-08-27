// Directly creates a new draft pre-inspection.
Cypress.Commands.add('createTestPreInspection', () => {
  cy.visit('/pre-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('create_new_inspection').click()
  cy.getTestElement('inspection_type_title').contains('ennakkotarkastus', {
    matchCase: false,
  })
  cy.getTestElement('inspection_status').should('contain.text', 'Muokattavissa')
})

// Opens an existing draft pre-inspection if one exists. Creates a new one if not found.
Cypress.Commands.add('openTestPreInspection', () => {
  cy.visit('/pre-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('select_inspection').then((selectInspection) => {
    cy.wait(1000).then(() => {
      if (selectInspection.find('[data-cy*="open_pre_inspection_Draft"]').length !== 0) {
        cy.getTestElement('open_pre_inspection_Draft', '*').first().click()
      } else {
        cy.getTestElement('create_new_inspection').click()
      }

      // We always want to check if departure blocks need to be fetched
      cy.getTestElement('departure_blocks_section').click()
      // Click fetch_departure_blocks if it exists
      cy.get('body').then(($body) => {
        if ($body.find('button[data-cy=fetch_departure_blocks]').length > 0) {
          cy.getTestElement('fetch_departure_blocks').click()
        }
      })
    })
  })

  cy.getTestElement('inspection_type_title').contains('ennakkotarkastus', {
    matchCase: false,
  })
  cy.getTestElement('inspection_status').should('contain.text', 'Muokattavissa')
})

// Brings a draft pre-inspection to InReview. Will fail if an InReview pre-
// inspection already exists.
Cypress.Commands.add('createTestReviewPreInspection', () => {
  cy.openTestPreInspection()

  cy.getTestElement('departure_blocks_section').click()

  cy.getTestElement('departure_blocks').then((depBlocks) => {
    if (depBlocks.find('[data-cy~="fetch_departure_blocks"]').length !== 0) {
      cy.getTestElement('fetch_departure_blocks').click()
    }
  })

  cy.getTestElement('departure_blocks_table_row', '*').should('have.length.at.least', 1)

  cy.getTestElement('submit_inspection').click()

  cy.getTestElement('inspection_status').should('contain.text', 'Käsittelee tietoja')
  cy.getTestElement('inspection_status').should('contain.text', 'Hyväksyttävänä')
})

// Opens a currently InReview pre-inspection or creates a new one if one does not exist.
Cypress.Commands.add('openTestReviewPreInspection', () => {
  cy.visit('/pre-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('select_inspection').then((selectInspection) => {
    cy.wait(1000).then(() => {
      if (selectInspection.find('[data-cy~="open_pre_inspection_InReview"]').length !== 0) {
        cy.getTestElement('open_pre_inspection_InReview').click()
      } else {
        cy.createTestReviewPreInspection()
      }
    })
  })

  cy.getTestElement('inspection_status').should('contain.text', 'Hyväksyttävänä')
})

Cypress.Commands.add('createTestProductionPreInspection', () => {
  cy.openTestReviewPreInspection()

  cy.getTestElement('publish_inspection').click()
  cy.getTestElement('inspection_status').should('contain.text', 'Tuotannossa')
})

Cypress.Commands.add('openTestProductionPreInspection', () => {
  cy.visit('/pre-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('select_inspection').then((selectInspection) => {
    cy.wait(1000).then(() => {
      if (
        selectInspection.find('[data-cy~="open_pre_inspection_InProduction"]').length !== 0
      ) {
        cy.getTestElement('open_pre_inspection_InProduction').click()
      } else {
        cy.createTestProductionPreInspection()
      }
    })
  })

  cy.getTestElement('inspection_status').should('contain.text', 'Tuotannossa')
})

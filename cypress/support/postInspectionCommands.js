// Directly creates a new draft post-inspection.
Cypress.Commands.add('createTestPostInspection', () => {
  cy.visit('/post-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('create_new_inspection').click()
  cy.getTestElement('inspection_type_title').contains('jälkitarkastus', {
    matchCase: false,
  })
  cy.getTestElement('inspection_status').should('contain.text', 'Muokattavissa')
})

// Opens an existing draft post-inspection if one exists. Creates a new one if not.
Cypress.Commands.add('openTestPostInspection', () => {
  cy.visit('/post-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('select_inspection').then((selectInspection) => {
    cy.wait(1000).then(() => {
      if (selectInspection.find('[data-cy*="open_post_inspection_Draft"]').length !== 0) {
        cy.getTestElement('open_post_inspection_Draft', '*').first().click()
      } else {
        cy.getTestElement('create_new_inspection').click()
      }
    })
  })

  cy.getTestElement('inspection_type_title').contains('jälkitarkastus', {
    matchCase: false,
  })
  cy.getTestElement('inspection_status').should('contain.text', 'Muokattavissa')
})

Cypress.Commands.add('ensureLinkedPreInspection', () => {
  // This is sadly a bit undeterministic.
  cy.getTestElement('update_linked_inspection').then((btn) => {
    if (!btn.prop('disabled')) {
      btn.click()
    }
  })

  cy.getTestElement('linked_inspection_', '*').should('have.length.at.least', 1)
  cy.getTestElement('create_execution_requirements').click()
})

// Brings a draft post-inspection to Sanctionable.
Cypress.Commands.add('createTestSanctionPostInspection', () => {
  // The post-inspection needs a published pre-inspection to be able to move into sanctioning.
  cy.openTestProductionPreInspection()
  cy.openTestPostInspection()

  cy.ensureLinkedPreInspection()

  cy.getTestElement('sanction_inspection').click()

  cy.getTestElement('inspection_status').should('contain.text', 'Käsittelee tietoja')
  cy.getTestElement('inspection_status').should('contain.text', 'Sanktioitavana')
})

// Opens a current post-inspection with the requested `status` or creates a new one if one does not exist.
Cypress.Commands.add('openTestSanctionPostInspection', () => {
  cy.visit('/post-inspection/edit')
  cy.selectTestSettings()

  cy.getTestElement('select_inspection').then((selectInspection) => {
    cy.wait(1000).then(() => {
      if (
        selectInspection.find(`[data-cy~="open_post_inspection_Sanctionable"]`).length !== 0
      ) {
        cy.getTestElement(`open_post_inspection_Sanctionable`).first().click()
      } else {
        cy.createTestSanctionPostInspection()
      }
    })
  })

  cy.getTestElement('inspection_status').should('contain.text', 'Sanktioitavana')
})

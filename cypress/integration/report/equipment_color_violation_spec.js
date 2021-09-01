describe('Equipment color violation', () => {
  before(() => {
    cy.loginAdmin()
    cy.generateTestData()
  })

  beforeEach(() => {
    cy.getEntityCountMap()
    cy.visitAndSpy('/')
  })

  afterEach(() => {
    cy.get('@consoleError', { timeout: 1000 }).should((errorLog) =>
      expect(errorLog).to.have.callCount(0)
    )
    cy.getTestElement('info_message_error').should('not.exist')
  })

  it('Gets correct count of pre-inspection color violations', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

    cy.getTestElement('inspection_tabs_tab_reports').click()
    cy.getTestElement('inspection_reports_report_section_equipmentColor').click()

    cy.getDeparturesPerUnitCount().then((departuresPerUnitCount) => {
      cy.getEquipmentPerCatalogueCount().then((equipmentPerCatalogueCount) => {
        let expectedRowCount = departuresPerUnitCount / equipmentPerCatalogueCount
        cy.getTestElement('table_totalRows').contains(expectedRowCount)
      })
    })
  })

  it('Gets correct count of post-inspection color violations', () => {
    cy.loginAdmin()
    cy.openTestSanctionPostInspection()

    cy.getDeparturesPerUnitCount().then((departuresPerUnitCount) => {
      cy.getEquipmentPerCatalogueCount().then((equipmentPerCatalogueCount) => {
        let expectedRowCount = departuresPerUnitCount / equipmentPerCatalogueCount

        // Check from sanctions tab
        cy.getTestElement('inspection_tabs_tab_sanction').click()
        cy.filterTableByValueAndKey(
          'EXTERIOR_COLOR_VIOLATION',
          'dropdown_sanctionReason',
          'edit_sanctions',
          expectedRowCount
        )

        // Check from reports tab
        cy.getTestElement('inspection_tabs_tab_reports').click()
        cy.getTestElement('inspection_reports_report_section_sanctionList').click()
        cy.filterTableByValueAndKey(
          'EXTERIOR_COLOR_VIOLATION',
          'dropdown_sanctionReason',
          'inspection_reports_report_sanctionList_table',
          expectedRowCount
        )
      })
    })
  })
})

import {
  getDeparturesPerUnitCount,
  getEquipmentPerCatalogueCount,
} from '../../support/expectedEntityCounts'

describe('Equipment color violation', () => {
  before(() => {
    cy.loginAdmin()
    cy.generateTestData()
    cy.getEntityCountMap()
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

  it('Gets correct count of pre-inspection color violations', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

    cy.wait(1000)

    cy.getTestElement('inspection_tabs_tab_reports').click()

    cy.getTestElement('inspection_reports_report_section_equipmentColor').click()

    let expectedRowCount = getDeparturesPerUnitCount() / getEquipmentPerCatalogueCount()
    cy.getTestElement('table_totalRows').contains(expectedRowCount)
  })

  it('Gets correct count of post-inspection color violations', () => {
    cy.loginAdmin()
    cy.openTestSanctionPostInspection()

    let expectedRowCount = getDeparturesPerUnitCount() / getEquipmentPerCatalogueCount()

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

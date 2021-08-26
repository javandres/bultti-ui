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

  it.only('Gets correct count pre-inspection color violations', () => {
    cy.loginAdmin()
    cy.openTestPreInspection()

    cy.wait(1000)

    cy.getTestElement('inspection_tabs_tab_reports').click()

    cy.getTestElement('inspection_reports_report_section_equipmentColor').click()

    // 2 options to test, TODO: pick 1

    // way 1
    cy.getDeparturesPerUnitCount().then((departuresPerUnit) => {
      cy.getEquipmentPerCatalogueCount().then((equipmentPerCatalogue) => {
        let expectedRowCount = departuresPerUnit / equipmentPerCatalogue
        cy.getTestElement('table_totalRows').contains(expectedRowCount)
      })
    })

    // way 2
    cy.getEntityCountMap().then((entityCountMap) => {
      let departuresPerUnit =
        entityCountMap.routes *
        entityCountMap.directions *
        entityCountMap.dayTypes *
        entityCountMap.departures
      let expectedRowCount = departuresPerUnit / entityCountMap.equipmentPerCatalogue
      cy.getTestElement('table_totalRows').contains(expectedRowCount)
    })
  })

  // TODO:
  // it('Gets correct count post-inspection color violations', () => {
  //   cy.loginAdmin()
  //   cy.createTestPostInspection()
  // })
})

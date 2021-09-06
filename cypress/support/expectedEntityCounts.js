// Seems like there is no solution to keep aliases in memory between the tests:
// https://github.com/cypress-io/cypress/issues/665#issuecomment-573625696
//
// So the solution is to run getEntityCountMap() in beforeEach hook AND we'll store the response in a regular variable: entityCountMap
// TODO: if you find a way to keep alias in memory where you can just run this command once, remove usage of
// this regular variable.
let entityCountMapCache = null // TODO: start using typescript and add an interface of this variable

Cypress.Commands.add('initEntityCountMap', () => {
  if (entityCountMapCache) {
    cy.wrap(entityCountMapCache).as('entityCountMap')
  } else {
    let requestEntityCountMap = new Promise((resolve, reject) => {
      const REACT_APP_SERVER_URL = Cypress.env('CYPRESS_REACT_APP_SERVER_URL')
      const testDataConfigQuery = `
        query testDataConfig {
          testDataConfig
        }
      `
      cy.request({
        method: 'POST',
        headers: {
          'Content-Type': 'application/graphql',
        },
        form: true,
        url: `${REACT_APP_SERVER_URL}/graphql`,
        body: { query: testDataConfigQuery, operationName: 'testDataConfig' },
      }).then((res) => {
        if (!res.body?.data?.testDataConfig) {
          console.log(
            'TestDataConfig query failed. Received res.body did not contain testDataConfig.'
          )
          reject()
        }
        let entityCountMap
        try {
          entityCountMap = JSON.parse(res.body.data?.testDataConfig)
        } catch (e) {
          console.log('JSON.parse on testDataConfig failed.')
          reject()
        }
        // Put the response in memory so that we don't have to make a request each time a test is ran
        entityCountMapCache = entityCountMap
        resolve(entityCountMap)
      })
    })
    cy.wrap(requestEntityCountMap).as('entityCountMap')
  }
})

Cypress.Commands.add('getDeparturesPerUnitCount', () => {
  cy.get('@entityCountMap').then((entityCountMap) => {
    return (
      entityCountMap.routes *
      entityCountMap.directions *
      entityCountMap.dayTypes *
      entityCountMap.departures
    )
  })
})
Cypress.Commands.add('getEquipmentPerCatalogueCount', () => {
  cy.get('@entityCountMap').then((entityCountMap) => {
    return entityCountMap.equipmentPerCatalogue
  })
})

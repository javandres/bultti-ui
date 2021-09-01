let entityCountMap = null // TODO: start using typescript and add an interface of this variable

Cypress.Commands.add('getEntityCountMap', () => {
  // Use cache if found
  if (entityCountMap) {
    return entityCountMap
  }

  if (entityCountMap) {
    return entityCountMap
  }

  const testDataConfigQuery = `
    query testDataConfig {
      testDataConfig
    }
  `

  const REACT_APP_SERVER_URL = Cypress.env('CYPRESS_REACT_APP_SERVER_URL')
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
      throw new Error(
        `TestDataConfig query failed. Received res.body did not contain testDataConfig.`
      )
    }
    entityCountMap = JSON.parse(res.body.data?.testDataConfig)

    return entityCountMap
  })
})

export function getDeparturesPerUnitCount() {
  return (
    entityCountMap.routes *
    entityCountMap.directions *
    entityCountMap.dayTypes *
    entityCountMap.departures
  )
}

export function getEquipmentPerCatalogueCount() {
  return entityCountMap.equipmentPerCatalogue
}

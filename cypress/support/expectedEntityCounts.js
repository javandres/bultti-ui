let entityCountMap = null

Cypress.Commands.add('getEntityCountMap', () => {
  // Use cache
  if (entityCountMap) {
    return entityCountMap
  }

  // If not found, TODO: request entityCountMap from backend

  // TODO: request entityCountMap from backend
  // if (!entityCountMap) {
  //   cy.request().then((response) => {
  //     ...
  //   })
  // }

  // ...and remove this hardcoding
  entityCountMap = {
    procurementUnits: 4,
    routes: 1, // 1 for each unit (there are multiple different routes though)
    directions: 2, // 2 for each route
    departures: 4, // 4 departures for each direction
    dayTypes: 7, // 7 day types for each departure
    schema: 1, // 1 for each dayType
    equipmentCatalogues: 1, // 1 for each unit
    equipmentTotal: 8, // 2 equipment for each catalogue
    equipmentPerCatalogue: 2,
    equipmentQuota: 1, // 1 for each equipment
  }

  return entityCountMap
})

Cypress.Commands.add('getDeparturesPerUnitCount', () => {
  return (
    entityCountMap.routes *
    entityCountMap.directions *
    entityCountMap.dayTypes *
    entityCountMap.departures
  )
})

Cypress.Commands.add('getEquipmentPerCatalogueCount', () => {
  return entityCountMap.equipmentPerCatalogue
})

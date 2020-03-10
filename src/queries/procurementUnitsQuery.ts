import gql from 'graphql-tag'

export const procurementUnitsQuery = gql`
  query procurementUnits($operatorId: String!, $startDate: Date!) {
    procurementUnits(operatorId: $operatorId, startDate: $startDate) {
      id
      procurementUnitId
      operatorId
      routes {
        length
        routeId
      }
      endDate
      operationEndDate
      operationStartDate
      startDate
      operatingArea
      weeklyExecutionMeters
      equipmentCatalogues {
        id
        operatorId
        startDate
        endDate
        procurementUnitId
        equipment {
          id
          make
          model
          operatorId
          percentageQuota
          registryDate
          registryNr
          co2
          emissionClass
          exteriorColor
          vehicleId
          type
        }
      }
    }
  }
`

export const procurementUnitQuery = gql`
  query procurementUnit($operatorId: String!, $procurementUnitId: String!, $startDate: Date!) {
    procurementUnit(
      operatorId: $operatorId
      procurementUnitId: $procurementUnitId
      startDate: $startDate
    ) {
      id
      operatorId
      routes {
        length
        routeId
      }
      endDate
      operationEndDate
      operationStartDate
      startDate
      operatingArea
      weeklyExecutionMeters
    }
  }
`
